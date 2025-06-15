import { TokenRepository } from "../token.repository";
import jwt from "jsonwebtoken";
import { convertExpiresInToMilliseconds } from "../../../../util/functions/generic.time.functions";
import { TokenDto } from "../../../../services/baseServices/token/token.service";
import { genericHashPassword } from "../../../../util/functions/generic.password.functions";

const SECRET_KEY = '%&ˆ5312765431726fgy65465342165344avdhasgdftfwqevav@##@'

export class TokenRepositoryJwtImplementation implements TokenRepository {
    private static instance: TokenRepositoryJwtImplementation;
    private readonly bcryptHashSeed: number;
    public readonly secretKey: string;
    public readonly expiresIn: string | number | null;
    public readonly expiresInMiliseconds: number | null;

    private constructor(){
        this.bcryptHashSeed = Number(process.env.TOKEN_HASH_SEED) || 10;
        this.secretKey = process.env.SECRET_KEY || SECRET_KEY;
        this.expiresIn = process.env.TOKEN_EXPIRES_IN || '1h';
        if ((this.expiresIn !== 'never') && (this.expiresIn !== null))
            this.expiresInMiliseconds = convertExpiresInToMilliseconds(this.expiresIn);
        else 
            this.expiresInMiliseconds = null;

    };

    public static build() {
        if (!TokenRepositoryJwtImplementation.instance) {
            TokenRepositoryJwtImplementation.instance = new TokenRepositoryJwtImplementation();
        }
        return TokenRepositoryJwtImplementation.instance;
    }

    public async generatePasswordHash(password: string): Promise<string> {
        console.log('Token.Repository.Jwt.Implement => generetePasswordHash => ', password, this.bcryptHashSeed)
        return await genericHashPassword(password, this.bcryptHashSeed);
    }

    public async generateToken(payload: object): Promise<TokenDto> {
        let token;
        let expiresIn = this.expiresIn;
        if ((this.expiresIn === 'never') || (this.expiresIn === null)){
            token = jwt.sign(payload, this.secretKey, {}); // generates never expires token
        } else {
            token = jwt.sign(payload, this.secretKey, { expiresIn: expiresIn as string | number });
            expiresIn = this.expiresInMiliseconds;
        }
        return { 
            token: token,
            expiresIn: expiresIn
        } 
    }

    public async decodeToken(token: string): Promise<{ userid: string; passwordHash: string; } | null> {
        const decoded = jwt.decode(token, { complete: true }) as jwt.JwtPayload | null;
        if (!decoded || !decoded.payload) {
            return null;
        }
        const { userid, password } = decoded.payload;
        return {userid, passwordHash: password};
    }

    public async verifyToken(token: string): Promise<boolean> {
        const verified = jwt.verify(token, this.secretKey);
        if (verified) return true;
        return false;
    }
}