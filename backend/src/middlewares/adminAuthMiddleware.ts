
import { AuthenticatedRequest } from "../types"
import { NextFunction, Response } from "express"
import jwt from 'jsonwebtoken'
import { adminSchema } from "../models/adminSchema"

export const adminProtect = async (req: AuthenticatedRequest, res: Response, next: NextFunction)=>{
    let token = req.cookies.AdminAccessToken
    // token=null
    if (!token) {
        return res.status(401).json({message: 'Access token is required'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        let Id
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded){
            Id = decoded.userId
        }
        const user = await adminSchema.findById(Id)
        if (!user){
            return res.status(404).json({ message: 'User  not found' })
        }
        req.body.user = user
        next()
    }catch(error){
        res.status(403).json({ message: 'Invalid token'})
    }
}