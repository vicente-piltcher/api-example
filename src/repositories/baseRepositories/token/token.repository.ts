import { TokenDto } from "../../../services/baseServices/token/token.service";

export interface TokenRepository {
    generatePasswordHash(password: string): Promise<string>;
    generateToken(payload: object, secretKey: string, expiresIn: string | number): Promise<TokenDto>;
    decodeToken(token: string): Promise<{ userid: string, passwordHash: string } | null>;
    verifyToken(token: string, secretKey: string): Promise<boolean>;    
}