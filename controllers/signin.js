const signinService = require('../services/signin');

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = { email, password };
    const response = await signinService(data);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json('Wrong crendentials');
  }
};

module.exports = signin;
