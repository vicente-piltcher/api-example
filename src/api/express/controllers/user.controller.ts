import { UserServiceFactory } from "../../../factories/baseFactories/user.service.factory";
import { Request, Response } from "express";

export class UserController {
    private constructor() {
    }

    public static build() {
        return new UserController();
    }

    public async register(request: Request, response: Response) {
        const { name, email, type, username, password } = request.body;
        const userService = UserServiceFactory.createUserService();
        const createUser = await userService.register(name, email, username, type, password);

        if ('id' in createUser) {
            return response.status(201).json(createUser).send();
        }

        if ('statusCode' in createUser) {
            return response.status(500).json(createUser).send();
        }
    }

    public async listall(request: Request, response: Response) {
        const userService = UserServiceFactory.createUserService();
        const listAll = await userService.list();

        if (listAll) {
            return response.status(200).json(listAll).send();;
        } else {
            return response.status(500).json({ statusCode: 500, message: 'Error listing users' }).send();
        }
    }

    public async findOneByEmail(request: Request, response: Response) {
        const { email } = request.body;
        const userService = UserServiceFactory.createUserService();
        const listAll = await userService.findOneByEmail(email);

        if (listAll) {
            return response.status(200).json(listAll).send();;
        } else {
            return response.status(500).json({ statusCode: 500, message: 'Error finding users' }).send();
        }

    }

    public async changePassword(request: Request, response: Response) {
        const { email, oldpassword, newpassword } = request.body;

        const userService = UserServiceFactory.createUserService();
        const changePassword = await userService.changePassword(email, oldpassword, newpassword);
        if (changePassword) {
            return response.status(200).json(changePassword).send();;
        } else {
            return response.status(500).json({ statusCode: 500, message: 'Error changing user password' }).send();
        }
    }

    public async login(request: Request, response: Response) {
    }

}