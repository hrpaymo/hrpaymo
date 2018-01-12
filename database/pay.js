const pg = require('./index.js').pg;
// const bookshelf = require('./index.js').bookshelf;

// const User = bookshelf.Model.extend({
//   tableName: 'users',
//   id: function() {
//     return this.hasMany(UserTransaction);
//   }
// });

// const Balance = bookshelf.Model.extend({
//   tableName: 'balance',
//   userId: function() {
//     return this.belongsTo(User);
//   }
// });

// const Transaction = bookshelf.Model.extend({
//   tableName: 'transactions',
//   txnId: function() {
//     return this.belongsTo(UserTransaction);
//   }
// });

// const UserTransaction = bookshelf.Model.extend({
//   tableName: 'users_transactions',
//   payerId: function() {
//     return this.belongsTo(Users);
//   },
//   payeeId: function() {
//     return this.belongsTo(Users);
//   },
//   txnId: function() {
//     return this.hasOne(Transaction)
//   }
// });

// const getBalance = function(payerId) {

// }

const pay = function(paymentData) {
  console.log('paying with info:', paymentData);
  let payerBalance = undefined;
  let payeeBalance = undefined;
  let payeeUserId = undefined;

  return pg.transaction(paymentTransaction => {
    // get the balance for the payer and ensure it's not too low
    return pg.table('balance')
    .transacting(paymentTransaction)
    .select('amount')
    .where({user_id: paymentData.payerId})
    .then(rows => {
      payerBalance = parseFloat(rows[0].amount);
      console.log('select payer balance:', payerBalance, 'txn amount:', typeof paymentData.amount);
      if(payerBalance < parseFloat(paymentData.amount)) {
        console.error('INSUFFICIENT FUNDS for userId:', paymentData.payerId);
        throw new Error('Insufficient funds.');
      }
    })
    // get the balance and user id for the payee
    .then(() => {
      return pg.table('users')
      .transacting(paymentTransaction)
      .select('amount', 'id')
      .innerJoin('balance', 'users.id', 'balance.user_id')
      .where({username: paymentData.payeeUsername})
      .then(rows => {
        if(rows.length === 0) {
          console.error('INVALID PAYEE USERNAME:', paymentData.payeeUsername);
          throw new Error('Invalid payee username.');
        }
        console.log('select payee balance amount:', rows[0].amount, 'with user id:', rows[0].id);
        payeeBalance = parseFloat(rows[0].amount);
        payeeUserId = parseInt(rows[0].id);
      })
    })
    // add a transaction to the users_transactions table and return the created txn_id
    .then(() => {
      return pg.table('users_transactions')
      .transacting(paymentTransaction)
      .returning('txn_id')
      .insert({
        payer_id: parseInt(paymentData.payerId),
        payee_id: payeeUserId
      })
    })
    // add a transaction to the transactions table with that txn_id
    .then(txn_id => {
      return pg.table('transactions')
      .transacting(paymentTransaction)
      .insert({
        txn_id: parseInt(txn_id),
        amount: parseFloat(paymentData.amount).toFixed(2),
        note: paymentData.note
      })
    })
    // update the payer's balance
    .then(() => {
      payerBalance -= parseFloat(paymentData.amount);
      return pg.table('balance')
      .transacting(paymentTransaction)
      .update({ amount: payerBalance })
      .where({ user_id: parseInt(paymentData.payerId) })
    })
    // update the payee's balance
    .then(() => {
      console.log('typeof payeeBalance:', typeof payeeBalance);
      payeeBalance += parseFloat(paymentData.amount);
      console.log('typeof payeeBalance:', typeof payeeBalance);
      return pg.table('balance')
      .transacting(paymentTransaction)
      .update({ amount: payeeBalance })
      .where({ user_id: payeeUserId})
    })
    // commit
    .then(paymentTransaction.commit)
    // return the payer's balance
    .then(() => payerBalance)
  })
  
  
}

module.exports = {
  pay: pay
}