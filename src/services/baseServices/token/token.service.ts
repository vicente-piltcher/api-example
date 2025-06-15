import jwt from "jsonwebtoken";

export type TokenDto = { 
    token: string,
    expiresIn: string | number | null
}

export interface TokenService { 
    generateToken(userId: string, password: string, expiresIn: string | number | null): Promise<TokenDto>;
    decodeToken(token: string): Promise<jwt.JwtPayload | null>;
    verifyToken(token: string): Promise<boolean>;
}