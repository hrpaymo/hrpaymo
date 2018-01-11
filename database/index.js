
require('dotenv').config();
module.exports = {
  pg: require('knex') ({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 7 }
  })
}

