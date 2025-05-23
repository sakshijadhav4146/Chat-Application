
const mongoose = require('mongoose')


const connectionString = process.env.MONGO_URI

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(connectionString);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}


module.exports = connectDB