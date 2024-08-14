"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cartItemSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Courses',
        required: true
    }
});
const enrollSchema = new mongoose_1.Schema({
    enrollId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Enrollment',
    }
});
const studentModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    profileImage: {
        type: String,
        default: null
    },
    googleUserId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'Active'
    },
    cart: {
        type: [cartItemSchema],
        default: []
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    enrollments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Enrollment',
        default: []
    },
    reviews: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Courses',
        default: []
    }
});
studentModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        console.log('is modified false');
        return next();
    }
    if (!this.password) {
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
exports.studentSchema = mongoose_1.default.model('Student', studentModel);
