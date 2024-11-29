const {createClient} = require('redis')


const redisClient = createClient({
    url: 'redis://localhost:6379'
})

redisClient.on('error', (err) => console.error('Error en Redis:', err));
redisClient.on('connect', () => console.log('Conectado a Redis'));

(async () => {
    await redisClient.connect()
})();

module.exports = redisClient