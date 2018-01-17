let axios = require('axios');

let client_id = '636654108787-tpfoiuolsol40okb92hejj1f3912dc7l.apps.googleusercontent.com';

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
  }
}