const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {;
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongo Connected : ${conn.connection.host}`)
        console.log(process.env.MONGO_URL)
    } catch (error) {
        console.log(`Error : ${error.message}`)
        process.exit(1) //1 -> exit with failure , 0-> exit with sucess
    }
}

module.exports = { connectDB };