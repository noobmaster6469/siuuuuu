require('dotenv').config();

const MongoDbConfig = {
    url : process.env.MONGODB_URL,
    dbname: process.env.MONGODB_DBNAME,
};

module.exports = {
    MongoDbConfig,
};