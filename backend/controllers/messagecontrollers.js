const Chat = require("../models/chats");
const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dh1cyxepv",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const fileData = req.file;

  if ((!content && !fileData) || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let fileUrl = "";
  let fileName = "";
  let fileType = "";
  let fileSize = 0;
  let attachment = false;

  // Handle file upload if present
  if (fileData) {
    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "chat-app-files"
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        // Convert buffer to stream and pipe to uploadStream
        const bufferStream = require('stream').Readable.from(fileData.buffer);
        bufferStream.pipe(uploadStream);
      });

      fileUrl = result.secure_url;
      fileName = fileData.originalname;
      fileSize = fileData.size;
      attachment = true;

      // Determine file type based on mimetype
      if (fileData.mimetype.startsWith('image/')) {
        fileType = "image";
      } else if (fileData.mimetype.startsWith('video/')) {
        fileType = "video";
      } else if (fileData.mimetype.startsWith('audio/')) {
        fileType = "audio";
      } else if (fileData.mimetype === 'application/pdf') {
        fileType = "pdf";
      } else {
        fileType = "document";
      }
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500);
      throw new Error("File upload failed");
    }
  }

  var newMessage = {
    sender: req.user._id,
    content: content || "",
    chats: chatId,
    attachment,
    fileUrl,
    fileName,
    fileType,
    fileSize
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name image");
    message = await message.populate("chats");
    message = await User.populate(message, {
      path: "chats.users",
      select: "name image email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMsg: message,
    });
    
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessage = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      chats: req.params.chatId,
    })
      .populate("sender", "name image email")
      .populate("chats");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  sendMessage,
  allMessage,
};