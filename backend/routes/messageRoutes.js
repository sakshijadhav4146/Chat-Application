const express = require('express');
const { sendMessage, allMessage } = require('../controllers/messagecontrollers');
const { jwtMiddleware } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Route for sending messages (with optional file attachment)
router.route('/')
  .post(jwtMiddleware, upload.single('file'), sendMessage);

// Route for fetching all messages
router.route('/:chatId')
  .get(jwtMiddleware, allMessage);

module.exports = router;