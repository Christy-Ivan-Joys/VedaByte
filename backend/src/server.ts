import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/userRoutes'
import { connectDB } from './config/db'
import instructorRouter from './routes/instructorRoutes'
import adminRoutes from './routes/adminRoutes'
import { SessionData } from 'express-session'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import errorHandler from './middlewares/errorHandler'
import { createServer } from 'http'
import { socketConfig } from './socketio'
import path from 'path'
declare module "express-session" {

  interface SessionData {
    otp: string;
    token: string;
  }
}

dotenv.config()
const app = express()

const server = createServer(app)

app.use(express.json())
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(cookieParser())
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
  },
}));


const port = process.env.PORT
connectDB()

app.use('/api/students', userRouter)
app.use('/api/instructor', instructorRouter)
app.use('/api/admin', adminRoutes)
app.use(errorHandler)

socketConfig(server)
const currentWorkingDir = path.resolve();
const parentDir = path.dirname(currentWorkingDir);

app.use(express.static(path.join(parentDir, "/frontend/dist")));

app.get("*", (req, res) =>
  res.sendFile(path.resolve(parentDir, "frontend", "dist", "index.html")))

server.listen(port, () => {
  console.log(`server started in port ${port}`)
})

export { app }    
        