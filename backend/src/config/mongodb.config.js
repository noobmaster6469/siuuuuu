require('dotenv').config();
const mongoose = require('mongoose');
const { MongoDbConfig } = require('./config');

const connectToMongoDB = async() => {
    try{
        await mongoose.connect(MongoDbConfig.url,{
            dbName: MongoDbConfig.dbname,
            autoCreate: true,
            autoIndex: true,
        })
        console.log("**********MongoDB connected successfully**********");

    }catch(error) {
        console.error('**********Error connecting to MongoDB:');
        console.error(error);
    }
}

module.exports = connectToMongoDB;