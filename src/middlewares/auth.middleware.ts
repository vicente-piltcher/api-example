import { NextFunction, Request, Response } from "express";
import { TokenServiceImplementation } from "../services/baseServices/token/token.service.implementation";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({message: 'Access denied. Token not informed.'}).send();
    }

    const tokenService = TokenServiceImplementation.build();
    const verified = tokenService.verifyToken(token);

    if (!verified) {
        return res.status(401).json({message: 'Access denied. Invalid token.'}).send();
    }

    const decoded = await tokenService.decodeToken(token);
    next();
}
