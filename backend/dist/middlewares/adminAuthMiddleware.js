"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProtect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminSchema_1 = require("../models/adminSchema");
const adminProtect = async (req, res, next) => {
    let token = req.cookies.AdminAccessToken;
    // token=null
    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let Id;
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
            Id = decoded.userId;
        }
        const user = await adminSchema_1.adminSchema.findById(Id);
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
exports.adminProtect = adminProtect;
