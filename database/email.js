const pg = require('./index.js').pg;
const feed = require('./feed.js');

module.exports = function (txnId) {
  return feed.emailFeed(5, txnId-1, 1)
  .then((results) => {
    return {
      payerUsername: results[0].payer_username,
      payerName: results[0].payer_firstName + results[0].payer_lastName,
      payerPic: results[0].payer_avatarUrl,
      paymentMessage: results[0].note,
      paymentDate: results[0].created_at,
      paymentAmount: results[0].amount,
      paymentId: results[0].txn_id,
      payeeEmail: results[0].payee_email,
      payeeUsername: results[0].payee_username
    }
  })


}
