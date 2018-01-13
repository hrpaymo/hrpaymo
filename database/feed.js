const pg = require('./index.js').pg;

const formatOutput = (item) => {
  return ({
    transactionId: item.txn_id,
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

var baseQuery = function(queryBuilder) {
  queryBuilder.select('transactions.txn_id', 
      'transactions.amount', 
      'transactions.note',
      'transactions.created_at',
      {payer_id: 'users_transactions.payer_id'}, 
      {payer_firstName: 'payer.first_name'},
      {payer_username: 'payer.last_name'},
      {payer_lastName: 'payer.last_name'},
      {payer_avatarUrl: 'payer.avatar_url'},
      {payee_id: 'users_transactions.payee_id'},
      {payee_username: 'payee.username'},
      {payee_firstName: 'payee.first_name'},
      {payee_lastName: 'payee.last_name'})
   .join('transactions', {'users_transactions.txn_id': 'transactions.txn_id'})
   .join('users as payee', {'payee.id': 'users_transactions.payee_id'})
   .join('users as payer', {'payer.id': 'users_transactions.payer_id'})
   .orderBy('transactions.txn_id', 'desc');
};

var olderThanIdQuery = function(queryBuilder, beforeId) {
  if (beforeId) {
    console.log('made it here', beforeId);
    queryBuilder.where('transactions.txn_id', '<=', beforeId);
  }
}

var sinceIdQuery = function(queryBuilder, sinceId) {
  if (sinceId) {
    console.log('nope');
    queryBuilder.where('transactions.txn_id', '>', sinceId);
  }
}

const globalFeed = function(limit, beforeId, sinceId) {
  return pg('users_transactions')
    .modify(baseQuery)
    .modify(olderThanIdQuery, beforeId)
    .modify(sinceIdQuery, sinceId)
    .limit(limit)
    .then(rows => {
      return rows.map(formatOutput);
   })
}

const myFeed = function(limit, beforeId, sinceId, userId) {
  console.log(limit,userId,beforeId,sinceId);

  if (beforeId) {
    return pg('users_transactions')
      .where(function() {
        this.where('users_transactions.payer_id', userId).orWhere('users_transactions.payee_id', userId)
      })
      .modify(baseQuery)
      .limit(2)
      .where('transactions.txn_id', '<=', beforeId)
      .then(rows => {
        return rows.map(formatOutput);
     })
  } else {
    return pg('users_transactions')
      .modify(baseQuery)
      .modify(sinceIdQuery, sinceId)
      .limit(limit)
      .where('users_transactions.payer_id', userId)
      .orWhere('users_transactions.payee_id', userId)
      .then(rows => {
        return rows.map(formatOutput);
     })
  }
}

module.exports = {
  globalFeed: globalFeed,
  myFeed: myFeed
};