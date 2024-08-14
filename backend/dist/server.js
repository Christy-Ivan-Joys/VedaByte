"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const db_1 = require("./config/db");
const instructorRoutes_1 = __importDefault(require("./routes/instructorRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const http_1 = require("http");
const socketio_1 = require("./socketio");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
app.use(express_1.default.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
    },
}));
const port = process.env.PORT;
(0, db_1.connectDB)();
app.use('/api/students', userRoutes_1.default);
app.use('/api/instructor', instructorRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use(errorHandler_1.default);
(0, socketio_1.socketConfig)(server);
const currentWorkingDir = path_1.default.resolve();
const parentDir = path_1.default.dirname(currentWorkingDir);
const __dirname = path_1.default.resolve();
app.use(express_1.default.static(path_1.default.join(parentDir, "/frontend/dist")));
app.get("*", (req, res) => res.sendFile(path_1.default.resolve(parentDir, "frontend", "dist", "index.html")));
server.listen(port, () => {
    console.log(`server started in port ${port}`);
});
