import { Request,Response,NextFunction } from "express";
import ErrorResponse from "../utils/Helpers/errorResponse";

const errorHandler = (err:ErrorResponse,req:Request,res:Response,next:NextFunction)=>{
const statusCode = err.statusCode || 500
const message = err.message || 'Internal Server Error';
res.status(statusCode).json({
    status:false,
    message
})
}
export default errorHandler
