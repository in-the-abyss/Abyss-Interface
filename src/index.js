const redis = require('redis');
const PORT=process.env.PORT || 80;
const REDIS_ENDPOINT=process.env.REDIS_ENDPOINT || 'redis';
const REDIS_PORT=process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD=process.env.REDIS_PASSWORD || "";
const channel = process.env.CHANNEL || "messages";
const cache = require('./Redis_handlers')
const logger = require('./logger');
require('dotenv').config();

let subscriber;
try {
    subscriber = redis.createClient({
        host: REDIS_ENDPOINT,
        port: REDIS_PORT,
        password: REDIS_PASSWORD
    })
} catch (err) {
    logger.error({
        message: "Redis connection failed!"
    });
    process.exit(1);
}

subscriber.on("message", (incomingChannel,message) => {
    if (incomingChannel === channel) {
        try {
            logger.info({
                message: message,
                channel: incomingChannel
            });
        } catch (e) {
            logger.error({
                message: "Error occured recieving message"
            })
        }    
    }
})

subscriber.on("error", function(error) {
    logger.error({
        message: error
    })
    process.exit(1);
});




subscriber.subscribe(channel);

