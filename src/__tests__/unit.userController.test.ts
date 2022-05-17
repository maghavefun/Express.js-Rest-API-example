import { Request, Response, NextFunction } from 'express'
import UserService from '../services/userService'
import UserController from '../controllers/userController'
import {IErrorResponse} from '../interfaces/errorResponseInterface'
import ErrorResponse from '../exceptions/errorResponse'
import httpStatusCodes from '../constants/httpStatusCodes'
import TokenService from '../services/tokenService'

jest.mock('../services/userService')
jest.mock('../services/tokenService')

const mUserWithCorrectCredentials = {
    login: 'test@gmail.com',
    password: '2FO34j6hkZj324'
}

const mUserWithIncorrectEmail = {
    login: 'test123@gmail.com',
    password: 'j54jkg834'
}

const mUserWithIncorrectPassword = {
    login: 'testgmail.com',
    password: '123'
}

let mReq: Request, mRes: Response

let mNextFunction: NextFunction

afterAll(async () => {
    jest.clearAllMocks()
})

describe('Controller: userController.ts', () => {

    describe('Method: login', () => {

        describe('Definition', () => {
            expect(UserController.login)
                .toBeDefined()
        })

        describe('Functionality', () => {

            describe('User with provided credentials exists and correct', () => {
                let jsonSpy: jest.SpyInstance

                beforeAll(async () => {
                    const mUserService = UserService
                    mUserService.login = jest.fn().mockImplementation(() => Promise.resolve(mUserWithCorrectCredentials))
                    mNextFunction = jest.fn()

                    mReq = {
                        body: mUserWithCorrectCredentials
                    } as Request

                    mRes = {
                        json: jest.fn()
                    } as any as Response

                    jsonSpy = jest.spyOn(mRes, 'json')

                    await UserController.login(mReq, mRes, mNextFunction)
                })

                it('should call json method with mockedUserData', () => {
                    expect(jsonSpy)
                        .toHaveBeenNthCalledWith(1, mUserWithCorrectCredentials)
                })
            })

            describe('User with provided email does not exist', () => {
                let notFound: IErrorResponse

                beforeAll(async () => {
                    notFound = new ErrorResponse(httpStatusCodes.NOT_FOUND)
                    const mUserService = UserService
                    mUserService.login = jest.fn().mockImplementation(() => Promise.reject(notFound))

                    mReq = {
                        body: mUserWithIncorrectEmail
                    } as Request

                    mRes = {} as Response

                    mNextFunction = jest.fn()

                    await UserController.login(mReq, mRes, mNextFunction)
                })

                it('should call next middleware with not found error', () => {
                    expect(mNextFunction)
                        .toHaveBeenNthCalledWith(1, notFound)
                })
            })

            describe('Provided password is incorrect', () => {
                let unathorizedError: IErrorResponse

                beforeAll(async () => {
                    unathorizedError = new ErrorResponse(httpStatusCodes.UNAUTHORIZED)
                    const mUserService = UserService
                    mUserService.login = jest.fn().mockImplementation(() => Promise.reject(unathorizedError))

                    mReq = {
                        body: mUserWithIncorrectPassword
                    } as Request

                    mRes = {} as Response

                    mNextFunction = jest.fn()

                    await UserController.login(mReq, mRes, mNextFunction)
                })

                it('should call next middleware with unathorized error', () => {
                    expect(mNextFunction)
                        .toHaveBeenNthCalledWith(1, unathorizedError)
                })
            })

            describe('Provided request body empty or does not contain required fields', () => {
                
                beforeAll(async () => {
                    const mUserService = UserService
                    mUserService.login = jest.fn().mockImplementation(() => Promise.reject())
                    
                    mReq = {
                        body: {}
                    } as Request

                    mRes = {} as Response

                    mNextFunction = jest.fn()

                    await UserController.login(mReq, mRes, mNextFunction)
                })

                it('should call next middleware with bad request error', () => {
                    expect(mNextFunction)
                        .toHaveBeenCalledTimes(1)
                })
            })
        })

    })

    describe('Method: signUp', () => {

        describe('Definition', () => {
            expect(UserController.signUp)
                .toBeDefined()
        })

        describe('Functinality', () => {

            describe('Provided email and password is valid', () => {
                let statusSpy: jest.SpyInstance

                beforeAll(async () => {
                    const mUserService = UserService
                    mUserService.signUp = jest.fn().mockImplementation(() => Promise.resolve(mUserWithCorrectCredentials))
                    mNextFunction = jest.fn()

                    mReq = {
                        body: mUserWithCorrectCredentials
                    } as Request

                    mRes = {
                        status: jest.fn().mockReturnValue({ send: jest.fn() })
                    } as any as Response

                    statusSpy = jest.spyOn(mRes, 'status')

                    await UserController.signUp(mReq, mRes, mNextFunction)
                })

                it('should call status method with mockedUserData', () => {
                    expect(statusSpy)
                        .toHaveBeenNthCalledWith(1, httpStatusCodes.CREATED)
                })
            })

            describe('Provided password is short or email/phone in incorrect form', () => {
                beforeAll(async () => {
                    const mUserService = UserService
                    mUserService.signUp = jest.fn().mockImplementation(() => Promise.resolve(mUserWithCorrectCredentials))
                    mNextFunction = jest.fn()

                    mReq = {
                        body: mUserWithIncorrectPassword
                    } as Request

                    mRes = { } as any as Response

                    await UserController.signUp(mReq, mRes, mNextFunction)
                })

                it('should call status method with mockedUserData', () => {
                    expect(mNextFunction)
                        .toBeCalledTimes(1)
                })
            })

            describe('Error occured when service called method signUp', () => {
                let internalServerError: IErrorResponse

                beforeAll(async () => {
                    const mUserService = UserService
                    internalServerError = new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
                    mUserService.signUp = jest.fn().mockImplementation(() => Promise.reject(internalServerError))
                    mNextFunction = jest.fn()

                    mReq = {
                        body: mUserWithCorrectCredentials
                    } as Request

                    mRes = { } as any as Response

                    await UserController.signUp(mReq, mRes, mNextFunction)
                })

                it('should call status method with mockedUserData', () => {
                    expect(mNextFunction)
                        .toHaveBeenNthCalledWith(1, internalServerError)
                })
            })
        })
    })

    describe('Method: updateToken', () => {

        describe('Definition', () => {
            expect(UserController.updateToken)
                .toBeDefined()
        })

        describe('Functinality', () => {
            
            describe('When request body contains refreshToken and userId', () => {
                let statusSpy: jest.SpyInstance

                beforeAll(async () => {
                    const mTokenService = TokenService
                    mTokenService.updateByRefreshToken = jest.fn().mockImplementation(() => Promise.resolve())
                    mNextFunction = jest.fn()

                    mReq = {
                        body: {
                            refreshToken: '123',
                            userId: 1,
                        }
                    } as Request

                    mRes = {
                        status: jest.fn().mockReturnValue({ send: jest.fn() })
                    } as any as Response

                    statusSpy = jest.spyOn(mRes, 'status')

                    await UserController.updateToken(mReq, mRes, mNextFunction)
                })

                it('should call status method and send updated token', () => {
                    expect(statusSpy)
                        .toHaveBeenNthCalledWith(1, httpStatusCodes.OK)
                })
            })

            describe('When request body does not contain refreshToken or userId', () => {
                let statusSpy: jest.SpyInstance

                beforeAll(async () => {
                    const mTokenService = TokenService
                    mTokenService.updateByRefreshToken = jest.fn().mockImplementation(() => Promise.reject())
                    mNextFunction = jest.fn()

                    mReq = {
                        body: { }
                    } as Request

                    mRes = {
                        status: jest.fn().mockReturnValue({ send: jest.fn() })
                    } as any as Response

                    statusSpy = jest.spyOn(mRes, 'status')

                    await UserController.updateToken(mReq, mRes, mNextFunction)
                })

                it('should call status method with badRequest', () => {
                    expect(statusSpy)
                        .toHaveBeenNthCalledWith(1, httpStatusCodes.BAD_REQUEST)
                })
            })

            describe('Occured error when call TokenService.updateByRefreshToken', () => {
                let internalServerError: IErrorResponse

                beforeAll(async () => {
                    const mTokenService = TokenService
                    internalServerError = new ErrorResponse(httpStatusCodes.INTERNAL_SERVER_ERROR)
                    mTokenService.updateByRefreshToken = jest.fn().mockImplementation(() => Promise.reject(internalServerError))
                    mNextFunction = jest.fn()

                    mReq = {
                        body: {
                            refreshToken: '123',
                            userId: 1,
                        }
                    } as Request

                    mRes = {} as any as Response

                    await UserController.updateToken(mReq, mRes, mNextFunction)
                })

                it('should call next middleware with internal server error', () => {
                    expect(mNextFunction)
                        .toHaveBeenNthCalledWith(1, internalServerError)
                })
            })

        })
    })


    describe('Method: getInfo', () => {

        describe('Definition', () => {
            expect(UserController.getInfo)
                .toBeDefined()
        })

        describe('Functionality', () => {

            describe('When params contains userID', () => {
                let sendSpy: jest.SpyInstance

                beforeAll(async () => {
                    mReq = {
                        params: {
                            userID: '1'
                        }
                    } as unknown as Request

                    mRes = {
                        send: jest.fn()
                    } as any as Response

                    sendSpy = jest.spyOn(mRes, 'send')

                    mNextFunction = jest.fn()

                    await UserController.getInfo(mReq, mRes, mNextFunction)
                })

                it('should call send method with userID', () => {
                    expect(sendSpy)
                        .toBeCalledWith(1)
                })
            })

        })
    })
})