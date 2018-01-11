//write database queries here 
var pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  // searchPath: 'knex,public',
  // pool: { min: 0, max: 7 },
  postProcessResponse: (result) => {
    // TODO: add special case for raw results (depends on dialect)
    if (Array.isArray(result)) {
      return result.map(row => convertToCamel(row));
    } else {
      return convertToCamel(result);
    }
  }
})

knex
  .from('users')
  .select('password')
  .where({username: 'user'})