"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function generateOtp() {
    const numbers = '1234567890';
    let otp = '';
    for (let i = 0; i < 4; i++) {
        otp += numbers[Math.floor(Math.random() * 10)];
    }
    return otp;
}
function SendMail(email) {
    const otp = generateOtp();
    const transport = nodemailer_1.default.createTransport({
        service: 'Gmail',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS,
        }
    });
    let info = transport.sendMail({
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Account authentication',
        text: otp
    });
    return otp;
}
exports.SendMail = SendMail;
