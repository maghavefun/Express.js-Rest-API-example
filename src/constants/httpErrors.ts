interface IHttpErrors {
    [key: string]: {
        error: string
        message: string
    }
}

export const httpErrors: IHttpErrors = {
    400: {
        error: 'Bad request',
        message: 'Please check the validity of the request.',
    },
    401: {
        error: 'Unauthorized',
        message: 'Please check that you are logged in to the system.',
    },
    403: {
        error: 'Forbidden',
        message: 'You do not have access to this path',
    },
    404: {
        error: 'Not found',
        message: 'Resource not found',
    },
    500: {
        error: 'Internal server error',
        message: 'Something went wrong',
    },
}
