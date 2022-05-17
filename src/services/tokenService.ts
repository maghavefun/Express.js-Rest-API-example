import jwt from 'jsonwebtoken'
import CONFIG from '../config'
import { IToken } from './../interfaces/tokenInterface'
import TokenModel from '../models/tokenModel'
import { IGeneratedTokens } from '../interfaces/generatedTokens'
import { IUser } from './../interfaces/userInterface'
import ErrorResponse from '../exceptions/errorResponse'
import httpStatusCodes from '../constants/httpStatusCodes'
import UserService from './userService'

class TokenService {


  static async generateTokens(payload: Omit<IUser, "password">): Promise<IGeneratedTokens> {
    const token = jwt.sign(payload, CONFIG.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
    const refreshToken = jwt.sign(payload, CONFIG.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})

    return {
      token,
      refreshToken
    }
  }


  static async save(userId: number, token: string, refreshToken: string): Promise<IToken> {
    let tokenData,
        tokens

    try {
      tokenData = await TokenModel.findOne({ where: { userId } })
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    if (tokenData) {
      tokenData.token = token
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    try {
      tokens = await TokenModel.create(
        {
          userId,
          token, 
          refreshToken
        })
    } catch {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    return tokens
  }


  static async updateByRefreshToken(refreshToken: string, userId: number) {
    let createdToken,
        tokenFromDB,
        user

    try {
      tokenFromDB = await TokenModel.findOne({ where: { userId }})
    } catch (error) {
      throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
    }

    if(tokenFromDB && tokenFromDB.refreshToken === refreshToken) {
      try {
        user = await UserService.findById(userId)
      } catch (error) {
        throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
      }

      if(user) {
        try {
          createdToken = await TokenService.generateTokens(user)
          tokenFromDB.token = createdToken.token
          tokenFromDB.refreshToken = createdToken.refreshToken
          await tokenFromDB.save()
        } catch (error) {
          throw new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
        }
        
        return tokenFromDB
      }
      
      throw new ErrorResponse(httpStatusCodes.NOT_FOUND)


    }

    throw new ErrorResponse(httpStatusCodes.BAD_REQUEST)
  }
}

export default TokenService