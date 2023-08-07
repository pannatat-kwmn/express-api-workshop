const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

//@desc Register a user
//@route POST /api/users/register
//@access public
const userRegister = (async (req, res) => {
  const { username, password , email} = req.body;
  if (!username || !password || !email) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const userAvailable = await User.findOne({ username });
  if (userAvailable) {
    res.status(400);
    throw new Error("This username is already taken");
  }
  const userSalt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, userSalt)
  console.log(`Hashed Password: ${hashedPassword}`)
  const user = await User.create({
    _id: crypto.randomUUID(),
    userName: username,
    userEmail: email,
    userPassword: hashedPassword,
    userSalt,
    approvalStatus: false,
    userRole: 'Member'
  });
  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("Register failed, please try again");
  }
});

//@desc Register a user
//@route POST /api/users/register
//@access public
const userLogin = (async (req,res) => {
  const { username, password } = req.body;
  if(!username || !password){
    res.status(400);
    throw new Error('Please fill Username and Password');
  }
  const user = await User.findOne({ userName: username });
  if(user && (await bcrypt.compare(password, user.userPassword))){
    const accessToken = jwt.sign(
      {
        users: {
          username: user.userName,
          userEmail: user.userEmail,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Username or password is not valid");
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = (async (req, res) => {
  res.json(req.user);
});

module.exports = { userRegister, userLogin, currentUser };