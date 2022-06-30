const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
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
  return db
    .select('*')
    .from('users')
    .then((response) => {
      res.status(200).json(response);
    });
});

app.post('/signing', (req, res) => {
  const { email, password } = req.body;
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        db.select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => {
            res.status(400).json('unable to find user');
          });
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('wrong credentials'));
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0].email,
            name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    res.status(400).json('not able to register');
  });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  return db
    .select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(404).json('Not found');
    });
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  return db
    .from('users')
    .where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json('unable to get entries'));
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
