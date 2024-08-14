
import { AuthenticatedRequest } from "../types"
import { NextFunction, Response } from "express"
import jwt from 'jsonwebtoken'
import { instructorSchema } from "../models/instructorSchema"


export const InstructorProtect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.InstructorAccessToken
    console.log(token)
    console.log(req.cookies.InstructorRefreshToken)
    if (!token) {
        return res.status(401).json({ message: 'Access token is required' })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
        let Id
        if (decoded && typeof decoded !== 'string' && 'userId' in decoded) {
            Id = decoded.userId
        }
        
        const user = await instructorSchema.findById(Id)
        if (!user) {
            return res.status(404).json({ message: 'User  not found' })
        }

        // if (user.isBlocked) {
        //     return res.status(403).json({ message: 'User is blocked' })
        // }
        req.body.user = user
        next()
    } catch (error) {

        res.status(403).json({ message: 'Invalid token' })
    }
}