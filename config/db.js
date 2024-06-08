const redis = require('redis')
const client = redis.createClient();

const connectToDB = async () => {
    try {
        client.connect();
        client.on('connect', () => console.log('Redis Connection Successful'));
    } catch (error) {
        console.log("Error",error);
        console.log("Database Connection Failed")
    }
}

module.exports = {
    connectToDB, client
}