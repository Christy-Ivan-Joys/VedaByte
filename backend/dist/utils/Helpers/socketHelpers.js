"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessageToDatabase = exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentSchema_1 = require("../../models/studentSchema");
const instructorSchema_1 = require("../../models/instructorSchema");
const chatSchema_1 = require("../../models/chatSchema");
const verifyUser = async (token) => {
    try {
        let decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded && 'role' in decoded) {
            const userId = decoded.userId;
            const role = decoded.role;
            if (role === 'Student') {
                const user = await studentSchema_1.studentSchema.findById(userId);
                return { user, role };
            }
            else if (role === 'Instructor') {
                console.log('InstructorAuth in socket');
                const user = await instructorSchema_1.instructorSchema.findById(userId);
                return { user, role };
            }
        }
        throw new Error('Invalid token');
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.verifyUser = verifyUser;
const saveMessageToDatabase = async (sender, recipient, message, Time, type) => {
    const newChat = await chatSchema_1.chatSchema.create({ sender, recipient, message, Time, type });
    return newChat;
};
exports.saveMessageToDatabase = saveMessageToDatabase;
