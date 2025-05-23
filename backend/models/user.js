const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
},{timestamps:true});


userSchema.pre("save",async function(next){
  const user = this;
  if(!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password,salt);

    user.password = hashedPassword;
    next()

  } catch (error) {
    return next(error);
  }
})

userSchema.methods.matchPassword = async function(password){
  try {
    return await bcrypt.compare(password,this.password)
  } catch (error) {
    throw error;
  }
}


const userModel = mongoose.model("User", userSchema);



module.exports = userModel;
