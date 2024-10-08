"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const connectionString = process.env.MONGO_URL ? process.env.MONGO_URL : '';
        const connect = await mongoose_1.default.connect(connectionString, {});
        console.log('Database connected successfully');
    }
    catch (error) {
        console.log('error in database connection', error);
    }
};
exports.connectDB = connectDB;
// mongodb://localhost:27017/VedaByte
// mongodb://christyivanjoys:Christy1@ac-ot4v53r-shard-00-00.zabnhj5.mongodb.net:27017,ac-ot4v53r-shard-00-01.zabnhj5.mongodb.net:27017,ac-ot4v53r-shard-00-02.zabnhj5.mongodb.net:27017/vedabyte?ssl=true&replicaSet=atlas-423d4u-shard-0&authSource=admin&retryWrites=true&w=majority
