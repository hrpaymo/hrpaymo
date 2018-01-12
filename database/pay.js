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

  // payerId: this.props.payerId,
  //     payeeUsername: this.state.payeeUsername,
  //     amount: this.state.amount
  return pg.transaction(paymentTransaction => {
    return pg.table('balance')
    .transacting(paymentTransaction)
    .select('balance')
    .where({user_id: paymentTransaction.payerId})
  })
  .then(rows => console.log('select returned rows:', rows))
  .then(paymentTransaction.commit)
}

module.exports = {
  pay: pay
}