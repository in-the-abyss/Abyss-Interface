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
            let parsedMessage = JSON.parse(message).message
            console.log('\x1b[0m', "Website: ", '\x1b[34m', `${parsedMessage.website}`, '\x1b[0m', "|  SKU:", "\x1b[32m",`${parsedMessage.sku}`, '\x1b[0m', "|  Quantity: ", "\x1b[33m", `${parsedMessage.quantity}`, '\x1b[0m', "|  Name:", "\x1b[31m", `${parsedMessage.name}`, '\x1b[0m');
        } catch (e) {
            logger.error({
                message: e
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

