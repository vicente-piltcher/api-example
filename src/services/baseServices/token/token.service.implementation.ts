import { TokenDto, TokenService } from "./token.service";
import { TokenRepositoryJwtImplementation } from "../../../repositories/baseRepositories/token/jwt/token.repository.jwt.implementation";

const SECRET_KEY = '%&ˆ5312765431726fgy65465342165344avdhasgdftfwqevav@##@'

export class TokenServiceImplementation implements TokenService {
    private static instance: TokenServiceImplementation;
    private readonly tokenRepository: TokenRepositoryJwtImplementation;

    private constructor() {
        this.tokenRepository = TokenRepositoryJwtImplementation.build();
    }

    // método para instanciar a classe do Serviço
    public static build(): TokenServiceImplementation {
        if (!TokenServiceImplementation.instance) {
            TokenServiceImplementation.instance = new TokenServiceImplementation();
        }
        return TokenServiceImplementation.instance;
    }

    // gera o token
    public async generateToken(userID: string, password: string): Promise<TokenDto> {
        const passwordHash = await this.tokenRepository.generatePasswordHash(password);
        const token = await this.tokenRepository.generateToken({userid: userID, password: passwordHash});
        return {
            token: token.token,
            expiresIn: token.expiresIn
        }
    }    

    // decodifica o token para obter o usuario e a senha
    public async decodeToken(token: string): Promise<{ userid: string, passwordHash: string } | null> {
        return await this.tokenRepository.decodeToken(token);
    }

    // verificar se o token enviado é válido
    public async verifyToken(token: string): Promise<boolean> {
        return await this.tokenRepository.verifyToken(token);
    }
}