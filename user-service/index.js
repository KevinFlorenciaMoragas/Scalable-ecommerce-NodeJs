const express = require('express');
require('dotenv').config();

const userRouter = require('./routes/user.routes');
const cors = require('cors');
const app = express();
const sequelize = require('./database/database');
async function startApp() {
    app.use(express.json());
    app.use(cors())
    app.use('/api', userRouter);
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
    await sequelize.sync({ alter: true })

}
startApp();