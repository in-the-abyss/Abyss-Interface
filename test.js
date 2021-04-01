var redis = require("redis");
const REDIS_ENDPOINT=process.env.REDIS_ENDPOINT || 'redis';
const REDIS_PORT=process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD=process.env.REDIS_PASSWORD || "";

var publisher = redis.createClient({
    host: REDIS_ENDPOINT,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
})

const channel = process.env.CHANNEL || "messages";

publisher.publish(channel, '{ "message": "Hello world!" }', function(){
    console.log("sent message")
    process.exit(0);
});