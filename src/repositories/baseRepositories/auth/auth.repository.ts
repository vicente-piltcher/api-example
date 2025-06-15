import { TokenDto } from "../../../services/baseServices/token/token.service";

export interface AuthRepository {
    isValidPassword(userPassword: string, informedPassword: string): Promise<boolean>;
    generateNewToken(userID: string, passwordHash: string, secretKey: string, expiresIn: string): Promise<TokenDto>;
}