"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repositories/userRepository");
const repository = new userRepository_1.userRepository();
const generateToken = (res, userId, identity) => {
    const payload = { userId, role: identity };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie(`${identity}AccessToken`, token, {
        httpOnly: false,
        secure: false,
        maxAge: 3600000,
        sameSite: 'strict',
        path: '/'
    });
    return token;
};
exports.generateToken = generateToken;
const generateRefreshToken = (res, userId, identity) => {
    const payload = { userId, role: identity };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_KEY, {
        expiresIn: '30d',
    });
    res.cookie(`${identity}RefreshToken`, token, {
        httpOnly: false,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
    });
    return token;
};
exports.generateRefreshToken = generateRefreshToken;
