"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const joi_1 = __importDefault(require("joi"));
// Validation
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
});
const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.message });
    const { name, email, password } = req.body;
    try {
        const userExists = await User_1.default.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered", userId: user._id });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.message });
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // 🔐 Create Access Token
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id.toString() }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env
                .ACCESS_TOKEN_EXPIRES,
        });
        // 🔁 Create Refresh Token
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id.toString() }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env
                .REFRESH_TOKEN_EXPIRES,
        });
        // 🍪 Store refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken });
    }
    catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        // Generate new access token
        const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, {
            expiresIn: process.env
                .ACCESS_TOKEN_EXPIRES,
        });
        res.json({ accessToken: newAccessToken });
    }
    catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};
exports.refreshToken = refreshToken;
const logout = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
};
exports.logout = logout;
