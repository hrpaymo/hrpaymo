const pg = require('./index.js').pg;

module.exports = {
  checkPasswordAtUsername: (username, callback) => {
    pg.table('users')
      .where({username: username})
      .select('id', 'password')
      .then((result) => {
        callback(result);
      });

  } 
}


