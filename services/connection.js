require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
  },
});

module.exports = db;
