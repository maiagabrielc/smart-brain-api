const express = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 4,
      joined: new Date(),
    },
  ],
};
app.get('/', (req, res) => {
  res.status(200).send('all fine by now');
});

app.post('/signing', (req, res) => {
  res.json('signing');
});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});