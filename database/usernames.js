const pg = require('./index.js').pg;

module.exports = {

  getUsernames: (userId) => {
    return pg.table('users')
      .select('username')
      .whereNot('id', userId)
      .orderBy('username');
  }
}
