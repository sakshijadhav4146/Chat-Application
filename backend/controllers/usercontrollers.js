
const asyncHandler = require('express-async-handler')
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');
const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,image} = req.body

    if(!name || !email || !password ){
        res.status(400);
        throw new Error("Please Enter all the field")
    }

    const userExits = await User.findOne({email })

    if(userExits){
        res.status(400);
        throw new Error("User already exists")
    }

    const user = await User.create({
        name,
        email,
        password,
        image
    })

    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            image:user.image,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400).json({error:"failed to add user"})
    }

})

const loginUser = asyncHandler(async(req,res)=>{
    
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        res.status(201).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            image:user.image,
            token:generateToken(user._id)
        })
    }
    else{
        res.status(400);
        throw new Error("Invalid Email or Password");

        
    }
})

const allUsers = asyncHandler(async(req,res) =>{
    const keyword = req.query.search?{
        $or:[
            {name:{
                $regex: req.query.search, $options:"i"
            }},
            {email :{
                $regex: req.query.search, $options:"i"
            }}
        ]
    }:{};
   
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.send(users)
})

module.exports={registerUser,loginUser,allUsers}