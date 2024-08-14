import jwt from 'jsonwebtoken'
import { Response, Request, NextFunction } from 'express'
import { userRepository } from '../repositories/userRepository'


const repository = new userRepository()

export const generateToken = (res: Response, userId: string, identity: string):string => {
    const payload = { userId,role:identity }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    })
    
    res.cookie(`${identity}AccessToken`, token, {
        httpOnly: false,
        secure: false,
        maxAge: 3600000,
        sameSite: 'strict',
        path: '/'    
    })
    return token
}


export const generateRefreshToken = (res: Response, userId: string, identity: string) => {
    const payload = { userId,role:identity }
    const token = jwt.sign(payload, process.env.JWT_REFRESH_KEY as string, {
        expiresIn: '30d',
    })

    res.cookie(`${identity}RefreshToken`, token, {
        httpOnly: false,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/'
    })
    return token
}

