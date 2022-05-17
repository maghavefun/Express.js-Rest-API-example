import { Request, Response, NextFunction } from 'express'
import { IErrorResponse } from '../interfaces/errorResponseInterface'
import httpStatusCodes from '../constants/httpStatusCodes'
import ErrorResponse from '../exceptions/errorResponse'

export const errorHandler = (error: IErrorResponse | Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof ErrorResponse) {
        error.setPath(req.path)

        return res
            .status(error.status)
            .send(error)
    }

    return res
        .status(httpStatusCodes.INTERNAL_SERVER_ERROR)
        .send(error)
}
