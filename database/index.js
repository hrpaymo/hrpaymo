
require('dotenv').config();
const knex = require('knex') ({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 0, max: 7 }
  });
const bookshelf = require('bookshelf')(knex);

module.exports = {
  pg: knex,
  bookshelf: bookshelf
}
