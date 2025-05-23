const express = require('express')
const {registerUser,loginUser, allUsers} = require('../controllers/usercontrollers');
const { jwtMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/',registerUser)
router.post('/login',loginUser)
router.get('/',jwtMiddleware,allUsers)

module.exports = router