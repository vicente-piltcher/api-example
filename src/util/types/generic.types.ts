import { ApiError } from "../../errors/appErrors";

// Tipo utilitário para transformar todos os campos em campos que aceitam null
export type Nullable<T> = {
    [P in keyof T]: T[P] | null | undefined;
};

export type DataValidationErrorDto = {
    fieldName: string
    errMessage: string
}

export type GenericErrorDto = {
    statusCode: number,
    message: string
}

export type GenericReturnResultDto = {
    error: boolean,
    statusCode: number,
    message: string,
    params: any | null,
    data: any | null,
    errorData: ApiError | null
}