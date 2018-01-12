const pg = require('./index.js').pg;

module.exports = {

  getUserInfo: (userId, callback) => {
    pg.table('users')
      .where({id: userId})
      .select('id', 'username', 'first_name', 'last_name', 'avatar_url')
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error, null);
      });
    },

  getBalance: (userId, callback) => {
    pg.table('balance')
      .where({user_id: userId})
      .select('amount')
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error, null);
      });
    }
};