const db = require('./connection');
const bcrypt = require('bcrypt');

const signinService = async ({ email, password }) => {
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            return user[0];
          })
          .catch((err) => {
            return err;
          });
      }
    });
};

module.exports = signinService;
