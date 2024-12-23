const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3100
const {handleBillEvent} = require('./handlers')
const {subscribeToEvents} = require('./pubsub')

async function startApp() {
    app.use(express.json());
    app.use(cors());
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    await subscribeToEvents('bill', handleBillEvent);
}

startApp();