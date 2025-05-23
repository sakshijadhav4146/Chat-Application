require('dotenv').config({path:'../.env'});
const express = require("express");
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/connection')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes')
const { errorHandler, notFound } = require('./middleware/errorHandler');

connectDB()
const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.get("/",(req, res) => {
  res.send("hello");
});

app.use('/api/user',userRoutes)
app.use('/api/chats',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler)


const server=app.listen(PORT,() => console.log(`SERVER STARTED ON ${PORT}` ));

const io =require('socket.io')(server,{
  pingTimeout: 60000,
  cors:{
    origin:"http://localhost:5173",
  }
})

io.on("connection",(socket)=>{
  console.log("connected to socket.io");
  socket.on('setup',(userData)=>{
    socket.join(userData._id);    
    socket.emit("connected")
  })

  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("user join room"+ room);
  })

  socket.on('typing',(room)=>{
    socket.in(room).emit("typing")
  })
  
  socket.on('stop typing',(room)=>{
    socket.in(room).emit("stop typing")
  })

  socket.on('new message',(newMessageReceived)=>{
    var chat = newMessageReceived.chats;

    if(!chat.users) return console.log('chat.users not defined');

    chat.users.forEach(user=>{
      if(user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    })
    
  })

  socket.off("setup",()=>{
    console.log("USER DISCONNECTED")
    socket.leave(userData._id)
  })
})