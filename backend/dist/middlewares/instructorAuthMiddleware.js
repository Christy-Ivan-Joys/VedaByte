"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorProtect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const instructorSchema_1 = require("../models/instructorSchema");
const InstructorProtect = async (req, res, next) => {
    let token = req.cookies.InstructorAccessToken;
    console.log(token);
    console.log(req.cookies.InstructorRefreshToken);
    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let Id;
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
            Id = decoded.userId;
        }
        const user = await instructorSchema_1.instructorSchema.findById(Id);
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        // if (user.isBlocked) {
        //     return res.status(403).json({ message: 'User is blocked' })
        // }
        req.body.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
exports.InstructorProtect = InstructorProtect;
