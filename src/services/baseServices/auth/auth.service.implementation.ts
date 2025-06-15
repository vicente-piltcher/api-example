import { AuthService } from "./auth.service";
import { UserRepositoryPrisma } from "../../../repositories/baseRepositories/user/prisma/user.repository.mapper.prisma";
import { PRISMACLIENT } from "../../../util/prisma.util";
import { GenericReturnResultDto } from "../../../util/types/generic.types";
import { GenericReturnResult } from "../../../util/genericReturnResult/genericReturnResult";
import { API_RETURN_CODES } from "../../../errors/appErrorsList";
import { TokenServiceImplementation } from "../token/token.service.implementation";
import { AuthRepositoryJwtImplementation } from "../../../repositories/baseRepositories/auth/jwt/auth.repository.jwt.implementation";
import { genericHashPassword } from "../../../util/functions/generic.password.functions";

export class AuthServiceImplementation implements AuthService {
    private static instance: AuthServiceImplementation;

    private constructor(readonly tokenService: TokenServiceImplementation, readonly authRepository: AuthRepositoryJwtImplementation) {
        this.authRepository = authRepository;
        this.tokenService = tokenService;
    }

    // método para instanciar a classe do Serviço
    public static build(tokenService?: TokenServiceImplementation, authRepository?: AuthRepositoryJwtImplementation): AuthServiceImplementation {
        if (!AuthServiceImplementation.instance) {
            AuthServiceImplementation.instance = 
                new AuthServiceImplementation(
                    tokenService || TokenServiceImplementation.build(), 
                    authRepository || AuthRepositoryJwtImplementation.build()
                );
        }
        return AuthServiceImplementation.instance;
    }

    // comparar se a senha informada é igual a armazenada
    private async isValidPassword(userPassword: string, informedPassword: string): Promise<boolean> {
        //return await bcrypt.compare(userPassword, informedPassword);
        return await this.authRepository.isValidPassword(userPassword, informedPassword);
    }

    public async hashPasword(password: string): Promise<string> {
        return await genericHashPassword(password, 10);
    }

    public async refreshToken(token: string): Promise<GenericReturnResultDto> {
        // verificar o token atual
        let returnKey: keyof typeof API_RETURN_CODES = 'SUCCESS';
        let returnMessage: string | null = 'Token refreshed with success.';
        let returnData: any = null;
    
        // Valida o token inicial
        if (!this.tokenService.verifyToken(token)) {
            return GenericReturnResult.throwReturn('INVALID_TOKEN', 'Verify Token', null, null);
        } 
    
        // Decodifica o token
        const tokenDecoded = await this.tokenService.decodeToken(token);

        if (!tokenDecoded) {
            return GenericReturnResult.throwReturn('INVALID_TOKEN', 'Decode token', null, null);
        }
    
        // Gera o novo token e define o tempo de expiração
        // const newToken = jwt.sign(tokenDecoded, this.secretKey, { expiresIn: '1h' });
        const newToken = await this.tokenService.generateToken(tokenDecoded.userid, tokenDecoded.passwordHash);
        
        returnData = { 
            token: newToken.token,
            expiresIn: newToken.expiresIn
        };

        return GenericReturnResult.throwReturn(returnKey, returnMessage, null, returnData);
    }

    public async login( user: { email: string, password: string }): Promise<GenericReturnResultDto> {
        let returnKey: keyof typeof API_RETURN_CODES = 'SUCCESS';
        let returnMessage: string | null = 'User logged in with success.'
        let returnParams: any = { user }
        let returnData: any = null;

        const userRepository = UserRepositoryPrisma.build(PRISMACLIENT);
        const findUser = await userRepository.findOneByEmail(user.email);

        if (!findUser) {
            return GenericReturnResult.throwReturn('NOT_FOUND', 'User not found.', returnParams, returnData);
        } 
        
        if (findUser && !this.isValidPassword(findUser.password, user.password)) {
            return GenericReturnResult.throwReturn('UNAUTHORIZED', 'Invalid password.', returnParams, returnData);
        }
        
        // se a senha é válida, retorna obtém o token de acesso
        const token = await this.tokenService.generateToken( findUser.id, user.password );
        returnData = { ...token }
        return GenericReturnResult.throwReturn(returnKey, returnMessage, returnParams, returnData);
    }

}