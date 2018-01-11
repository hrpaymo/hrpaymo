//write database queries here 
// var pg = require('knex')({
//   client: 'pg',
//   connection: process.env.DATABASE_URL,
//   // searchPath: 'knex,public',
//   // pool: { min: 0, max: 7 },
//   postProcessResponse: (result) => {
//     // TODO: add special case for raw results (depends on dialect)
//     if (Array.isArray(result)) {
//       return result.map(row => convertToCamel(row));
//     } else {
//       return convertToCamel(result);
//     }
//   }
// })

var pg = require('knex')({
  client: 'pg',
  // version: '7.2',
  connection: {
    host : '127.0.0.1',
    user : 'acenine',
    password : '',
    database : 'hrpaymo'
  }
});

module.exports = {
  checkPasswordAtUsername: (username, callback) => { // login = {username:<username>, password:<password>}
    pg.table('users')
      .where({user_name: username})
      .select('id', 'password')
      .then((result) => {
        callback(result);
      });

  } 
}


