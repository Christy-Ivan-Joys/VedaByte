"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewModel = new mongoose_1.default.Schema({
    courseId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Courses',
    },
    reviewerId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Student',
        require: true
    },
    comment: {
        type: String,
        require: true,
    },
    rating: {
        type: Number,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});
exports.reviewSchema = mongoose_1.default.model('Review', reviewModel);
