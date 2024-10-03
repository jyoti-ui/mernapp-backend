const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn : "3d"});
}
const registerUserController = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    const user = await userModel.register(email, password, fullName);

    //create a token
    const token = createToken(user._id);
    res.status(200).json({user, token});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUserController = async (req, res) => {
    const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);

    //create a token
    const token = createToken(user._id);
    res.status(200).json({user, token});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUserController,
  loginUserController,
};
