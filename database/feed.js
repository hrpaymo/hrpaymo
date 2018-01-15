const pg = require('./index.js').pg;
const moment = require('moment');

// HELPER function to format and manipulate output prior to sending back to server

const formatOutput = (item, userId) => {
  let amount = null;

  // If the logged-in user was involved in the transaction, display amount
  // otherwise drop
  if (userId && (userId === item.payer_id || userId === item.payee_id)) {
    amount = item.amount;
    if (amount && (userId === item.payer_id)) {
      amount = '-' + amount;
    }
  }

  let formattedDate = moment(item.created_at).format('MMMM Do YYYY, h:mm a');

  return ({
    transactionId: item.txn_id,
    amount: amount,
    note: item.note,
    timestamp: formattedDate,
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

// FIELD LIST
// Public and Private fields

const FEED_FIELDS = ['transactions.txn_id',
  'transactions.note',
  'transactions.amount',
  'transactions.created_at',
  {payer_id: 'users_transactions.payer_id'}, 
  {payer_firstName: 'payer.first_name'},
  {payer_username: 'payer.username'},
  {payer_lastName: 'payer.last_name'},
  {payer_avatarUrl: 'payer.avatar_url'},
  {payee_id: 'users_transactions.payee_id'},
  {payee_username: 'payee.username'},
  {payee_firstName: 'payee.first_name'},
  {payee_lastName: 'payee.last_name'}
];

// MODULAR BUILDING BLOCKS
// Modular Postgres Queries that can be combined to create various queries

// Basic joins to pull all needed transaction data
let baseTransactionConnections = function(queryBuilder) {
  queryBuilder.join('transactions', {'users_transactions.txn_id': 'transactions.txn_id'})
   .join('users as payee', {'payee.id': 'users_transactions.payee_id'})
   .join('users as payer', {'payer.id': 'users_transactions.payer_id'})
   .orderBy('transactions.txn_id', 'desc');
};

// Restriction for pulling queries using a "previous page token"
let olderThanIdQuery = function(queryBuilder, beforeId) {
  if (beforeId) {
    queryBuilder.where('transactions.txn_id', '<=', beforeId);
  }
}

// Pull queries more recent than currently displayed
let sinceIdQuery = function(queryBuilder, sinceId) {
  if (sinceId) {
    queryBuilder.where('transactions.txn_id', '>', sinceId);
  }
}

let mustIncludeUserById = function(queryBuilder, userId) {
  queryBuilder.where(function() {
    this.where('users_transactions.payer_id', userId).orWhere('users_transactions.payee_id', userId)
  });
};

let mustIncludeUserByUsername = function(queryBuilder, username) {
  if (username) {
    queryBuilder.where(function() {
      this.where('payer.username', username).orWhere('payee.username', username)
    });
  }
};

// QUERIES TO SURFACE TO SERVER
// All queries accept beforeId and sinceId to return transactions before/after a particular transaction ID

module.exports = {
  // Return most recent transactions, with all public fields.
  globalFeed: function(limit, beforeId, sinceId, userId) {
    return pg('users_transactions')
      .select(...FEED_FIELDS)
      .modify(baseTransactionConnections)
      .modify(olderThanIdQuery, beforeId)
      .modify(sinceIdQuery, sinceId)
      .limit(limit)
      .then(rows => {
        return rows.map((item) => formatOutput(item, userId));
     })
  },

  // Return most recent transactions involving a single user.
  // Returns public and private fields.
  myFeed: function(limit, beforeId, sinceId, userId) {
    return pg('users_transactions')
      .select(...FEED_FIELDS)
      .modify(baseTransactionConnections)
      .modify(mustIncludeUserById, userId)
      .modify(olderThanIdQuery, beforeId)
      .modify(sinceIdQuery, sinceId)
      .limit(limit)
      .then(rows => {
        return rows.map((item) => formatOutput(item, userId));
      })
  },

  // Return recent transactions involving a single user.
  // Returns public and private fields. 
  // GETS transactions filtered by PROFILEID, but FORMATS OUTPUT based on LOGGED-IN USER
  profileFeed: function(limit, beforeId, sinceId, profileUsername, userId) {
    return pg('users_transactions')
      .select(...FEED_FIELDS)
      .modify(baseTransactionConnections)
      .modify(mustIncludeUserByUsername, profileUsername)
      .modify(olderThanIdQuery, beforeId)
      .modify(sinceIdQuery, sinceId)
      .limit(limit)
      .then(rows => {
        return rows.map((item) => formatOutput(item, userId));
      })
  },

  // 
  profileFeedRelational: function(limit, beforeId, sinceId, profileUsername, userId) {
    return pg('users_transactions')
      .select(...FEED_FIELDS)
      .modify(baseTransactionConnections)
      .modify(mustIncludeUserByUsername, profileUsername)
      .modify(mustIncludeUserById, userId)
      .modify(olderThanIdQuery, beforeId)
      .modify(sinceIdQuery, sinceId)
      .limit(limit)
      .then(rows => {
        return rows.map((item) => formatOutput(item, userId));
      })
  }
};