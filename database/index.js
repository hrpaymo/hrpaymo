
require('dotenv').config();
const knex = require('knex') ({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 7 }
  });

module.exports = {
  pg: knex
}
