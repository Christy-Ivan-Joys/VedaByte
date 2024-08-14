"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel = new mongoose_1.default.Schema({
    sender: {
        type: Object,
        required: true
    },
    recipient: {
        type: Object,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    Time: {
        type: String,
        default: null
    },
    type: {
        type: String,
        require: true
    }
});
exports.chatSchema = mongoose_1.default.model('Chat', chatModel);
