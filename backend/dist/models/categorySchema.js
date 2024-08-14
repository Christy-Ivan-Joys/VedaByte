"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categoryModel = new mongoose_1.default.Schema({
    category: {
        type: String,
        required: true
    },
    categoryImage: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});
exports.categorySchema = mongoose_1.default.model('Category', categoryModel);
