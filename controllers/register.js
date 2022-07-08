const registerService = require('../services/register');

const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const data = { email, name, password };
    const response = await registerService(data);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json('Not able to register.');
  }
};

module.exports = register;
