const { createClient } = require("redis");
const { v4: uuidv4 } = require('uuid');

let redisClient;
let redisClientPublisher;
let redisClientSubscriber;

async function connectRedis() {
    try {
        redisClient = createClient();
        await redisClient.connect();
        console.log("Redis Client Connected");

        redisClientPublisher = redisClient;
        redisClientSubscriber = redisClient.duplicate();
        await redisClientSubscriber.connect();
        console.log("Redis Subscriber Connected");

        return {
            redisClientPublisher,
            redisClientSubscriber
        };
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        process.exit(1); // Salir si no se puede conectar
    }
}

async function publishEvent(event, channel, data) {
    if (!redisClient) {
        await connectRedis();
    }
    await redisClientPublisher.publish(channel, JSON.stringify({ event, data, message_id: uuidv4() }));
    console.log(`Published event ${event} to channel ${channel}`);
}

async function subscribeToEvents(channel, handler) {
    if (!redisClient) await connectRedis();
    console.log(`Subscribing to channel ${channel}`);
    await redisClientSubscriber.subscribe(channel, (message) => {
        console.log(`Received message: ${message}`);
        const parsedMessage = JSON.parse(message);
        handler(parsedMessage);
    });
}

module.exports = {
    publishEvent,
    subscribeToEvents
};