const bcrypt = require('bcrypt');
const db = require('./connection');

const registerService = async ({ email, name, password }) => {
  const hash = bcrypt.hashSync(password, 10);
  return db.transaction((trx) => {
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
            return user[0];
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};

module.exports = registerService;
