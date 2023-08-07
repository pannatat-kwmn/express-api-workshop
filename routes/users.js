var express = require('express');
var router = express.Router();

const {
  userRegister,
  userLogin,
  currentUser
} = require("../controllers/usersController");
const validateToken = require('../middleware/tokenValidation');

router.post("/register", userRegister);
router.post('/login', userLogin);
router.get('/current', validateToken, currentUser )

module.exports = router;