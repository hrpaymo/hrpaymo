const pg = require('./index.js').pg;

module.exports = {
  getPasswordAtUsername: (username, callback) => {
    pg.table('users')
      .where({username: username})
      .select('id', 'password')
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => {
        callback(error, null);
      });
  } 
}
