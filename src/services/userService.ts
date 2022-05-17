import bcyrpt from 'bcryptjs'
import { Request } from 'express'
import CONFIG from '../config'
import httpStatusCodes from '../constants/httpStatusCodes'
import ErrorResponse from '../exceptions/errorResponse'
import UserModel from '../models/userModel'
import TokenService from './tokenService'
import TokenModel from '../models/tokenModel'
import { IUser } from './../interfaces/userInterface'

class UserService {

    
    static async login(login: string, password: string): Promise<any> {
        let user,
            tokens,
            savedToken

        try {
            user = await UserModel.findOne({where: {login}})
        } catch (error) {
            throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
        }

        if(user && bcyrpt.hashSync(password, CONFIG.SALT) === user.password) {
            let { firstName, lastName, login, id } = user
            let userWithoutPassword = { firstName, lastName, login, id }

            try {
                tokens = await TokenService.generateTokens(userWithoutPassword)
                savedToken = await TokenService.save(id, tokens.token, tokens.refreshToken)
            } catch (error) {
                throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
            }

            return {
                ...userWithoutPassword,
                token: savedToken.token,
                refreshToken: savedToken.refreshToken,
                type: savedToken.type,
                expires: savedToken.expires
            }
        }

        throw new ErrorResponse(httpStatusCodes.UNAUTHORIZED)
    }


    static async signUp(payload: Request['body']) {
        let createdUser,
            tokens,
            savedTokens

        try {
            createdUser = await UserModel.create(payload)
        } catch {
            throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
        }

        
        let { firstName, lastName, login, id } = createdUser
        let userWithoutPassword = { firstName, lastName, login, id }

        try {
            tokens = await TokenService.generateTokens(userWithoutPassword)
            savedTokens = await TokenService.save(id, tokens.token, tokens.refreshToken)
        } catch (error) {
            throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
        }

        return savedTokens
    }

    static async findById(id: number): Promise<Omit<IUser, 'password'>> {
        let foundUser,
            user

        try {
            foundUser = await UserModel.findByPk(id)
        } catch (error) {
            throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
        }
        

        if(foundUser) {
            user = {
                id: foundUser.id,
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                login: foundUser.login
            }

            return user
        }

        throw new ErrorResponse(httpStatusCodes.NOT_FOUND)
    }


    static async logout(id: number) {
        try {
            TokenModel.destroy({where: { userId: id }})
        } catch {
            throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}

export default UserService
