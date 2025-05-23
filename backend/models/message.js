const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        trim:true
    },
    chats:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    },
    attachment: {
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String,
        default: ""
    },
    fileName: {
        type: String,
        default: ""
    },
    fileType: {
        type: String,
        default: "" // Can be "image", "document", "audio", "video", etc.
    },
    fileSize: {
        type: Number,
        default: 0
    }
},{timestamps:true})

const messageModel = mongoose.model('Message',messageSchema)

module.exports = messageModel