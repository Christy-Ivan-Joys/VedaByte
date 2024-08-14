"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const qualificationSchema = new mongoose_1.default.Schema({
    degree: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
});
const certificationSchema = new mongoose_1.default.Schema({
    certification: {
        type: String,
        required: true
    }
});
const instructorModel = new mongoose_1.default.Schema({
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
    googleUserId: {
        type: String,
        default: null
    },
    profileImage: {
        type: String,
        default: null
    },
    status: {
        type: String,
        default: 'Active'
    },
    profession: {
        type: String,
        default: null
    },
    qualifications: {
        type: [qualificationSchema],
        default: []
    },
    certifications: {
        type: [certificationSchema],
        default: []
    }
});
instructorModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    if (!this.password) {
        return;
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
exports.instructorSchema = mongoose_1.default.model('Instructor', instructorModel);
