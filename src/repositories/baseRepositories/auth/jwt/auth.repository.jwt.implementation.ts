import { AuthRepository } from "../auth.repository";
import { TokenRepositoryJwtImplementation } from "../../token/jwt/token.repository.jwt.implementation";
import { TokenDto } from "../../../../services/baseServices/token/token.service";
import { genericIsValidPassword } from "../../../../util/functions/generic.password.functions";

export class AuthRepositoryJwtImplementation implements AuthRepository {
    private static instance: AuthRepositoryJwtImplementation;

    private constructor() {};

    public static build(): AuthRepositoryJwtImplementation {
        if (!AuthRepositoryJwtImplementation.instance) {
            AuthRepositoryJwtImplementation.instance = new AuthRepositoryJwtImplementation();
        }
        return AuthRepositoryJwtImplementation.instance;
    }

    public async isValidPassword(userPassword: string, informedPassword: string): Promise<boolean> {
        return genericIsValidPassword(userPassword, informedPassword);
    }

    public async generateNewToken(userID: string, passwordHash: string, expiresIn: string): Promise<TokenDto> {
        const tokenRepository = TokenRepositoryJwtImplementation.build();
        const newToken = tokenRepository.generateToken({userid: userID, password: passwordHash});
        return newToken;
    }
}