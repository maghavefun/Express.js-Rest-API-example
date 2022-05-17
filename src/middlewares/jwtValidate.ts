import { IUser } from './../interfaces/userInterface'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import CONFIG from '../config'
import httpStatusCodes from "../constants/httpStatusCodes";

const jwtValidate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.sendStatus(httpStatusCodes.UNAUTHORIZED)
    }

    jwt.verify(token as string, CONFIG.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.sendStatus(httpStatusCodes.FORBIDDEN)
        }
        req.params.userID = String((decoded as IUser).id)

        return next()
    })

}

export default jwtValidate
