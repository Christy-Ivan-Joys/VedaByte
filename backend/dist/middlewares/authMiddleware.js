"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProtect = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentSchema_1 = require("../models/studentSchema");
const adminSchema_1 = require("../models/adminSchema");
const protect = async (req, res, next) => {
    let token = req.cookies.StudentAccessToken;
    if (!token) {
        console.log('no access token');
        return res.status(401).json({ message: 'Access token is required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let Id;
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
            Id = decoded.userId;
        }
        const user = await studentSchema_1.studentSchema.findById(Id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked' });
        }
        req.body.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
exports.protect = protect;
const AdminProtect = async (req, res, next) => {
    let token = req.cookies.AdminAccessToken;
    const refreshToken = req.cookies.AdminRefreshToken;
    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        let Id;
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
            Id = decoded.userId;
        }
        const user = await adminSchema_1.adminSchema.findById(Id);
        console.log(user, 'user in protect');
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        req.body.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
exports.AdminProtect = AdminProtect;
