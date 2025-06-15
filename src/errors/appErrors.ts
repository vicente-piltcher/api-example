import { API_RETURN_CODES } from "./appErrorsList";

type ApiErrorProps = {
    statusCode: number,
    message: string,
    errorStatus: boolean
}

export class ApiError extends Error {
    private constructor(readonly statusCode: number, readonly message: string, readonly erroStatus: boolean) {
        super(message);
        this.statusCode = statusCode;
        this.erroStatus = erroStatus;
        Error.captureStackTrace(this, ApiError)
    }

    public async create(statusCode: number, message: string, errorStatus: boolean) {
        return new ApiError(statusCode, message, errorStatus);
    }

    static fromReturnCode(returnCode: keyof typeof API_RETURN_CODES, returnMessage: string | null): ApiError {
        const error = API_RETURN_CODES[returnCode];
        return new ApiError(error.statusCode, `${returnMessage}: ${error.message}`, error.erroStatus)
    }
}