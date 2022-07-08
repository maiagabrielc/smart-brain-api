const express = require('express');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// app.get('/', (req, res) => {
//   return db
//     .select('*')
//     .from('users')
//     .then((response) => {
//       res.status(200).json(response);
//     });
// });

app.post('/signin', signin);

app.post('/register', register);

app.get('/profile/:id', profile);

app.put('/image', image);

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
