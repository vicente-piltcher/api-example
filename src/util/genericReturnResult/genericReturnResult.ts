import { ApiError } from "../../errors/appErrors";
import { API_RETURN_CODES } from "../../errors/appErrorsList";
import { GenericReturnResultDto } from "../types/generic.types";

export class GenericReturnResult {
    private constructor(readonly result: GenericReturnResultDto) {
        this.result = result;
    }

    public static create(error: boolean, statusCode: number, message: string, params: any | null, data: any | null, errorData: ApiError | null) {
        return new GenericReturnResult({
            error,
            statusCode,
            message,
            params,
            data,
            errorData
        })
    }

    public static throwReturn(returnToken: keyof typeof API_RETURN_CODES, returnMessage: string | null, params: any, data: any): Promise<GenericReturnResultDto> {
        const newError = ApiError.fromReturnCode(returnToken, returnMessage);
        const result = {
            error: newError.erroStatus,
            statusCode: newError.statusCode,
            message: newError.message,
            params: params,
            data: data,
            errorData: newError
        }
        return Promise.resolve(result);
    }
}