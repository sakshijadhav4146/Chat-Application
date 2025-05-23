const express = require('express');
const { jwtMiddleware } = require('../middleware/auth');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatcontrollers');

const router = express.Router();

/// routes for accessing a chats //////
router.route('/')
.post(jwtMiddleware,accessChat) 
.get(jwtMiddleware,fetchChats)


//// routes for group chats////
router.post('/group',jwtMiddleware,createGroupChat)
router.put('/rename',jwtMiddleware,renameGroup)
router.put('/groupremove',jwtMiddleware,removeFromGroup)
router.put('/groupadd',jwtMiddleware,addToGroup)


module.exports = router