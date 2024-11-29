const express = require('express');
const {
    login,
    register,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    changePassword
} = require('../controllers/user.controller.js');
//const { checkToken, checkAdmin } = require('../../utils/checkToken');

const router = express.Router();

router.get('/users', async (req, res) => await getUsers(req, res));
router.get('/user/:id', async (req, res) => await getUser(req, res));
router.post('/register', async (req, res) => await register(req, res));
router.post('/login', async (req, res) => await login(req, res));
router.put('/user/:id', async (req, res) => await updateUser(req, res));
router.put('/change-password/:id', async (req, res) => await changePassword(req, res));
router.delete('/user/:id', async (req, res) => await deleteUser(req, res));
module.exports = router;