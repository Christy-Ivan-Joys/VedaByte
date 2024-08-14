import { AuthenticatedRequest } from "../types"
import { NextFunction, Response } from "express"
import jwt from "jsonwebtoken"
import { studentSchema } from "../models/studentSchema"
import { instructorSchema } from "../models/instructorSchema"
import { adminSchema } from "../models/adminSchema"

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
     
    let token = req.cookies.StudentAccessToken
    
    if (!token){
        console.log('no access token')
        return res.status(401).json({ message: 'Access token is required' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        let Id
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
            Id = decoded.userId
        }
        const user = await studentSchema.findById(Id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked' })
        }
        req.body.user = user
        next()
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' })
    }
}

export const AdminProtect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.AdminAccessToken
    const refreshToken = req.cookies.AdminRefreshToken

    if (!token) {
        return res.status(401).json({ message: 'Access token is required' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        console.log(decoded)
        let Id
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
            Id = decoded.userId
        }
        const user = await adminSchema.findById(Id)
        console.log(user, 'user in protect')
        if (!user) {
            return res.status(404).json({ message: 'User  not found' })
        }


        req.body.user = user
        next()
    } catch (error) {

        res.status(403).json({ message: 'Invalid token' })
    }
}
