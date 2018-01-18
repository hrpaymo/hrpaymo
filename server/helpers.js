let axios = require('axios');
let emailjs = require('emailjs');
const db = require('../database/queries.js');
let client_id = '636654108787-tpfoiuolsol40okb92hejj1f3912dc7l.apps.googleusercontent.com';
let payTemplate = require('./paymentTemplate');
const moment = require('moment');

let server = emailjs.server.connect({
  user: "paywaal",
  password: "Paywaal123",
  host: 'smtp.gmail.com',
  ssl: true
})


module.exports = {
  buildFeedObject: (items, limit) => {

    let itemCount = items ? items.length : 0
    let nextPageTransactionId = itemCount > limit ? items[itemCount - 1].transactionId : null;
    let itemArray = nextPageTransactionId ? items.slice(0, limit) : items;
    let resolvedCount = nextPageTransactionId ? itemCount - 1 : itemCount;

    let results = {
      count: resolvedCount,
      newestTransactionId: itemCount > 0 ? items[0].transactionId : null,
      nextPageTransactionId: nextPageTransactionId,
      items: itemArray
    }

    return results;
  },

  validateIdToken: (token) => {
  return axios.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + token)
    .then(response => {
      if (response.data.aud === client_id && (response.data.iss === 'accounts.google.com' || response.data.iss === 'https://accounts.google.com')) {
        return response.data;
      }
    })
    .catch((err) => {
      console.log('token validation failed', err);
    })
  },

  sendEmail: (txnId) => {
    db.email(txnId)
      .then((result) => {
        payTemplate = payTemplate.replace('{{payer_username}}', result.payerUsername);
        payTemplate = payTemplate.replace('{{payer_name}}', result.payerName);
        payTemplate = payTemplate.replace('{{payer_avatar_url}}', result.payerPic);
        payTemplate = payTemplate.replace('{{payment_message}}', result.paymentMessage);
        payTemplate = payTemplate.replace('{{payment_date}}', moment(result.paymentDate).format('MMMM Do YYYY, h:mm'));
        payTemplate = payTemplate.replace('{{payment_amount}}', result.paymentAmount);
        payTemplate = payTemplate.replace('{{payment_id}}', result.paymentId);
        payTemplate = payTemplate.replace('{{payee_username}}', result.payeeUsername);

        var message = {
          text: "",
          from: "PayWaal Inc.",
          to: result.payeeEmail,
          subject: `${result.payerName} paid you $${result.paymentAmount}`,
          attachment: [{ data: payTemplate, alternative: true }]
        };

        // send as type html encoding
        server.send(message, function (err, message) { 
          if (err) {console.log('error send email', err)}
          else { console.log('successful email send') }
      })
      .catch((err) => {
        console.log('error send email', err);
      })
    })
  }
}