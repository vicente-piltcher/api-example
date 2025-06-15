import { Request, Response } from "express";
import { AuthServiceImplementation } from "../../../services/baseServices/auth/auth.service.implementation";

export class AuthController {
    private constructor() {};

    public static build() {
        return new AuthController();
    }

    public async login (request: Request, response: Response) {
        const authService = AuthServiceImplementation.build();
        const { username, email, password } = request.body
        const result = await authService.login({email, password});

        return response.status(result.statusCode).json(result).send();
    }

    public async refreshToken (request: Request, response: Response) {
        const authService = AuthServiceImplementation.build();
        const { token } = request.body;
        const result = await authService.refreshToken(token);

        return response.status(result.statusCode).json(result).send();
    }
}