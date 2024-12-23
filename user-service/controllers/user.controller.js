const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { publishEvent } = require('../pubsub');
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, address, postalCode } = req.body;
        const role = "user";
        if (!firstName || !lastName || !email || !password || !role || !address || !postalCode) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userCreated = await User.create({ firstName, lastName, email, password: hashedPassword, role, address, postalCode });
        
        await publishEvent('user:created', "user", { user_id: userCreated.dataValues.id });
        
        return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const findedUser = await User.findOne({ where: { email} });
        const bcryptpassword = await bcrypt.compare(password, findedUser.password);
        console.log(bcryptpassword)
        if (!bcryptpassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log(SECRET_KEY)
        const token = jwt.sign({ userId: findedUser.id, role: findedUser.role }, SECRET_KEY, { expiresIn: '1h' })
        console.log(token)
        res.cookie('token', token);
        return res.status(200).json({ message: "Logged in successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log("Estoy en users",users)
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, password, role, address, postalCode } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        await user.update({ firstName, lastName, email, password, role, address, postalCode });
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword });
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        await user.destroy();
        
        console.log('Publishing user:deleted event');
        await publishEvent('user:deleted', "user", { user_id: id });
        console.log('Published user:deleted event');
        
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login, getUsers, getUser, updateUser, changePassword, deleteUser };