const pg = require('./index.js').pg;

const formatOutput = (item) => {
  return ({
    transactionId: item.id,
    amount: item.amount,
    note: item.note,
    timestamp: item.created_at,
    payer: {
      userId: item.payer_id,
      username: item.payer_username,
      firstName: item.payer_firstName,
      lastName: item.payer_lastName,
      fullName: item.payer_firstName + ' ' + item.payer_lastName,
      avatarUrl: item.payer_avatarUrl
    },
    payee: {
      userId: item.payee_id,
      username: item.payee_username,
      firstName: item.payee_firstName,
      lastName: item.payee_lastName,
      fullName: item.payee_firstName + ' ' + item.payee_lastName
    }
  })
}

const feed = function(limit) {
  return pg('users_transactions')
   .select('transactions.id', 
      'transactions.amount', 
      'transactions.note',
      'transactions.created_at',
      {payer_id: 'users_transactions.payer_id'}, 
      {payer_firstName: 'payer.last_name'},
      {payer_username: 'payer.last_name'},
      {payer_lastName: 'payer.last_name'},
      {payer_avatarUrl: 'payer.avatar_url'},
      {payee_id: 'users_transactions.payee_id'},
      {payee_username: 'payee.username'},
      {payee_firstName: 'payee.first_name'},
      {payee_lastName: 'payee.last_name'})
   .limit(limit)
   .join('transactions', 'users_transactions.id', '=', 'transactions.id')
   .join('users as payee',{'payee.id':'users_transactions.payee_id'})
   .join('users as payer',{'payer.id':'users_transactions.payer_id'})
   .orderBy('transactions.created_at', 'desc')
   .then(rows => {
      return rows.map(formatOutput);
   })
}

module.exports = feed;