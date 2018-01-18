const pg = require('./index.js').pg;

const pay = function(paymentDataFromServer) {
  let localPaymentInfo = {
    payerBalance: undefined,
    payeeBalance: undefined,
    payeeUserId: undefined
  }

  return new Promise ((res, rej) => {
    return pg.transaction(paymentTransaction => {
      return Promise.all([
        getPayerBalance(paymentTransaction, localPaymentInfo, paymentDataFromServer),
        getPayeeInfo(paymentTransaction, localPaymentInfo, paymentDataFromServer)
      ])
      // add to the users_transactions table and return created txn_id
      .then(() => {
        return pg.table('users_transactions')
        .transacting(paymentTransaction)
        .returning('txn_id')
        .insert({
          payer_id: paymentDataFromServer.payerId,
          payee_id: localPaymentInfo.payeeUserId
        })
      })
      // add to the transactions table with txn_id
      .then(txn_id => {
        return Promise.all([
          addTransaction(paymentTransaction, txn_id, paymentDataFromServer),
          updatePayerBalance(paymentTransaction, paymentDataFromServer, localPaymentInfo),
          updatePayeeBalance(paymentTransaction, paymentDataFromServer, localPaymentInfo)
        ])
      })
      // commit
      .then(paymentTransaction.commit)
      // return the payer's balance
      .then(() => {
        res(localPaymentInfo.payerBalance);
      })
      .catch(err => {
        paymentTransaction.rollback;
        rej(err);
      })
    });
  })
}

const getPayerBalance = function(paymentTransaction, localPaymentInfo, paymentDataFromServer) {
  return pg.table('balance')
  .transacting(paymentTransaction)
  .select('amount')
  .where({user_id: paymentDataFromServer.payerId})
  .then(rows => {
    localPaymentInfo.payerBalance = parseFloat(rows[0].amount);
    if(localPaymentInfo.payerBalance < parseFloat(paymentDataFromServer.amount)) {
      // return Promise.reject(new Error('Insufficient funds.'));
      throw new Error('Insufficient funds.');
    }
  })
}

const getPayeeInfo = function(paymentTransaction, localPaymentInfo, paymentDataFromServer) {
  return pg.table('users')
  .transacting(paymentTransaction)
  .select('amount', 'id')
  .innerJoin('balance', 'users.id', 'balance.user_id')
  .where({username: paymentDataFromServer.payeeUsername})
  .then(rows => {
    // if no user or payer userid === payee userid, throw error
    if(rows.length === 0 || rows[0].id === paymentDataFromServer.payerId) {
      throw new Error('Invalid payee username:', paymentDataFromServer.payeeUsername);
    }
    localPaymentInfo.payeeBalance = parseFloat(rows[0].amount);
    localPaymentInfo.payeeUserId = rows[0].id;
  })
}

const addTransaction = function(paymentTransaction, txn_id, paymentDataFromServer) {
  return pg.table('transactions')
  .transacting(paymentTransaction)
  .insert({
    txn_id: parseInt(txn_id[0]),
    amount: parseFloat(paymentDataFromServer.amount).toFixed(2),
    note: paymentDataFromServer.note
  })
}

const updatePayerBalance = function(paymentTransaction, paymentDataFromServer, localPaymentInfo) {
  localPaymentInfo.payerBalance -= parseFloat(paymentDataFromServer.amount);
  return pg.table('balance')
  .transacting(paymentTransaction)
  .update({ amount: localPaymentInfo.payerBalance })
  .where({ user_id: paymentDataFromServer.payerId })
}

const updatePayeeBalance = function(paymentTransaction, paymentDataFromServer, localPaymentInfo) {
  localPaymentInfo.payeeBalance += parseFloat(paymentDataFromServer.amount);
  return pg.table('balance')
  .transacting(paymentTransaction)
  .update({ amount: localPaymentInfo.payeeBalance })
  .where({ user_id: localPaymentInfo.payeeUserId})
}

module.exports = {
  pay: pay
}