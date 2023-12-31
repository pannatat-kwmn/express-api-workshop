const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

//@desc Register a user
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

//@desc user login
//@access public
const userLogin = (async (req,res) => {
  const { username, password } = req.body;
  if(!username || !password){
    res.status(400).json({ error: 'Please fill Username and Password' });
  }
  const user = await User.findOne({ userName: username });
  if(user && (await bcrypt.compare(password, user.userPassword))){
    if(!user.approvalStatus){
      res.status(401).json({ error: 'Your account has not been approved yet.'})
    }
    const accessToken = jwt.sign(
      {
        users: {
          id: user.id,
          username: user.userName,
          userEmail: user.userEmail,
          userRole: user.userRole
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401).json({ error: "Username or password is not valid"})
  }
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = (async (req, res) => {
  res.json(req.user);
});

//@desc approve user member
//@access private
const approveUser = async (req, res) => {
  const { requestStatus } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const approvedUser = await User.findByIdAndUpdate(req.params.id, {
      approvalStatus: requestStatus
    }, { new: true });
    if (!approvedUser) {
      return res.status(404).json({ error: 'User approval failed.' });
    }
    res.status(200).json(approvedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { userRegister, userLogin, currentUser, approveUser };