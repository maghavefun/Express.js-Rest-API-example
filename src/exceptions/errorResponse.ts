import { IErrorResponse } from '../interfaces/errorResponseInterface';
import { httpErrors } from '../constants/httpErrors'
import httpStatusCodes from '../constants/httpStatusCodes'

class ErrorResponse implements IErrorResponse {
    timestamp
    status
    message
    error
    path

    constructor(status: httpStatusCodes, timestamp = new Date()) {
        this.timestamp = timestamp
        this.path = ''
        this.status = status
        this.message = ''
        this.error = ''

        switch(status) {
            case httpStatusCodes.BAD_REQUEST:
                this.setBadRequest()
                break

            case httpStatusCodes.UNAUTHORIZED:
                this.setUnathorized()
                break

            case httpStatusCodes.FORBIDDEN:
                this.setForbidden()
                break

            case httpStatusCodes.NOT_FOUND:
                this.setNotFound()
                break

            case httpStatusCodes.INTERNAL_SERVER_ERROR:
                this.setInternalServerError()
                break

            default:
                this.setInternalServerError()
        }
    }

    setBadRequest() {
        this.error = httpErrors[httpStatusCodes.BAD_REQUEST].error
        this.message = httpErrors[httpStatusCodes.BAD_REQUEST].message
    }

    setUnathorized() {
        this.error = httpErrors[httpStatusCodes.UNAUTHORIZED].error
        this.message = httpErrors[httpStatusCodes.UNAUTHORIZED].message
    }

    setForbidden() {
        this.error = httpErrors[httpStatusCodes.FORBIDDEN].error
        this.message = httpErrors[httpStatusCodes.FORBIDDEN].message
    }

    setNotFound() {
        this.error = httpErrors[httpStatusCodes.NOT_FOUND].error
        this.message = httpErrors[httpStatusCodes.NOT_FOUND].message
    }

    setInternalServerError() {
        this.status = httpStatusCodes.INTERNAL_SERVER_ERROR
        this.error = httpErrors[httpStatusCodes.INTERNAL_SERVER_ERROR].error
        this.message = httpErrors[httpStatusCodes.INTERNAL_SERVER_ERROR].message
    }

    setPath(path: string) {
        this.path = path
    }

}

export default ErrorResponse
