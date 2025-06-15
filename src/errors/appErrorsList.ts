// errors.ts
export const API_RETURN_CODES = {
    SUCCESS: {
        statusCode: 200,
        message: 'OK',
        erroStatus: false
    },
    NOT_FOUND: {
        statusCode: 404,
        message: 'Resource not found',
        erroStatus: true
    },
    UNAUTHORIZED: {
        statusCode: 401,
        message: 'Unauthorized access',
        erroStatus: true
    },
    FORBIDDEN: {
        statusCode: 403,
        message: 'You do not have permission to perform this action',
        erroStatus: true
    },
    SERVER_ERROR: {
        statusCode: 500,
        message: 'Internal server error',
        erroStatus: true
    },
    BAD_REQUEST: {
        statusCode: 400,
        message: 'Bad request',
        erroStatus: true
    },
    INVALID_TOKEN: {
        statusCode: 401,
        message: 'Invalid Token',
        erroStatus: true
    },
    INVALID_PASSWORD: { 
        statusCode: 401,
        message: 'Invalid Password',
        erroStatus: true
    }

};
