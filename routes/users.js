var express = require('express');
var router = express.Router();

const {
  userRegister,
  userLogin,
  currentUser,
  approveUser
} = require("../controllers/usersController");
const { 
  validateToken,
  userRoleCheck
} = require('../middleware/tokenValidation');

router.post("/register", userRegister);
router.post('/login', userLogin);
router.put('/approve', [validateToken, userRoleCheck ], approveUser);

module.exports = router;