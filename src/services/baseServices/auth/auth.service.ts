import { ApiError } from "../../../errors/appErrors";
import { GenericReturnResultDto } from "../../../util/types/generic.types";

export interface AuthService {
    refreshToken(token: string): Promise<GenericReturnResultDto>;
    login( user: { email: string, password: string } ): Promise<ApiError | GenericReturnResultDto>;
    hashPasword(password: string): Promise<string>;
}