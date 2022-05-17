import {NextFunction, Request, Response} from 'express'
import UserService from '../services/userService'
import httpStatusCodes from '../constants/httpStatusCodes'
import ErrorResponse from '../exceptions/errorResponse'
import Validator from './validator'
import TokenService from '../services/tokenService'

class UserController {

    static async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        let userData
        const { login , password } = req.body

        if( login && password) {
            try {
                userData = await UserService.login(login, password)
            } catch (error) {
                return next(error)
            }

            return res.json(userData)
        }

        return next(new ErrorResponse(httpStatusCodes.BAD_REQUEST))
    }

    static async signUp(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const { login, password } = req.body
        let tokens

        if(Validator.isLoginValid(login) && Validator.isPasswordValid(password)) {
            try {
                tokens = await UserService.signUp(req.body)
            } catch (error) {
                return next(error)
            }

            return res.status(httpStatusCodes.CREATED).send(tokens)
        }

        return next(new ErrorResponse(httpStatusCodes.BAD_REQUEST))
    }

    static async updateToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        let updatedToken
        const { refreshToken, userId } = req.body

        if(refreshToken && userId) {
            try {
                updatedToken = await TokenService.updateByRefreshToken(refreshToken, userId)
            } catch (error) {
                return next(error)
            }

            return res.status(httpStatusCodes.OK).send(updatedToken)
        }

        return res
            .status(httpStatusCodes.BAD_REQUEST)
            .send(new ErrorResponse(httpStatusCodes.BAD_REQUEST))
    }


    static async getInfo(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userID = Number(req.params.userID)

        if(req.params.userID) {
            return res.send(userID)
        }

        return res.sendStatus(httpStatusCodes.UNAUTHORIZED)
    }


    static async logout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        const userID = Number(req.params.userID)
        try {
            await UserService.logout(userID)
        } catch (error) {
            return next(error)
        }
        return res.sendStatus(httpStatusCodes.OK)
    }
}

export default UserController
