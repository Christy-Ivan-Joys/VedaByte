"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const courseModel = new mongoose_1.default.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    courselevel: {
        type: String
    },
    price: {
        type: String
    },
    isApproved: {
        type: String,
        default: 'pending'
    },
    courseImage: {
        type: String
    },
    Introvideo: {
        type: String
    },
    InstructorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    module: [
        {
            title: {
                type: String
            },
            videoURL: {
                type: String
            },
            description: {
                type: String
            },
            duration: {
                type: String
            }
        }
    ]
});
exports.courseSchema = mongoose_1.default.model('Courses', courseModel);
