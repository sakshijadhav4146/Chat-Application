require('dotenv').config();
const jwt = require('jsonwebtoken')

const jwtMiddleware = async(req,res,next)=>{
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')?
    req.headers.authorization.split(' ')[1]:null;
    
    
    if(!token) return res.status(400).json({error:"Token Not Found"})
    try {
        const decode = await jwt.verify(token,process.env.JWT_SECRETKEY)
     
        req.user = decode
        next()
    } catch (error) {
        return res.status(400).json(error)
    }  
}

const generateToken = (user)=>{
    const payload = {
        _id: user._id,
        email: user.email
    }
    const token = jwt.sign(payload,process.env.JWT_SECRETKEY,{
        expiresIn:'2d'
    })
    return token
}

module.exports = {
    generateToken,
    jwtMiddleware
}