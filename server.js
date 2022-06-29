const express = require('express');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

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

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then((response) => {
      res.status(200).json(response);
    });
});

app.post('/signing', (req, res) => {
  res.json('signing');
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db('users')
    .returning('*')
    .insert({
      email,
      name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => {
      res.status(400).json('not able to register');
    });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(404).json('Not found');
    });
});

app.put('/image', (req, res) => {
  res.json('image');
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
