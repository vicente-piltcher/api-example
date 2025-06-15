/**
 * Necessário refatorar essa classe para ser o mapper para o Prisma
 * Assim pode-se criar um mapper para outro ORM ou outro meio de conectar-se ao Banco de dados deixando menos acoplado
 */


import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../user.repository";
import { User, UserStatus, UserTypes } from "../../../../entities/users";
import { GenericErrorDto } from "../../../../util/types/generic.types";

export class UserRepositoryPrisma implements UserRepository {

    private constructor (readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient) {
        return new UserRepositoryPrisma(prisma);
    }

    public async create(user: User): Promise<User | GenericErrorDto> {
        const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            password: user.password,
            type: user.type,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
        const newUser = await this.prisma.user.create({ data });
        if (!newUser) {
            return Promise.reject({
                statusCode: 500,
                message: 'Error creating user'
            })
        }

        return Promise.resolve(User.with(newUser.id, newUser.name, newUser.email, newUser.username, newUser.password, newUser.type as UserTypes, newUser.status as UserStatus, newUser.createdAt, newUser.updatedAt));
    }

    public async listAll(): Promise<User[] | null> {
        let data: any;
        const listAll = await this.prisma.user.findMany();

        if (!listAll) {
            return null;
        }

        const userList = listAll.map ((user) => {
            const { id, name, email, username, password, type, status, createdAt, updatedAt } = user;
            return User.with(
                id,
                name,
                email,
                username,
                password,
                type as UserTypes,
                status as UserStatus,
                createdAt,
                updatedAt
            );
        });
        return userList;
    }
    
    public async findOneById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    public async findOneByEmail(email: string): Promise<User | null> {

        console.log("email", email)

        try {
            const findUser = await this.prisma.user.findUnique({ where: { email: email } });
            if (!findUser) {
                return await Promise.reject(null);
            }

            console.log("AAA", findUser);


            return Promise.resolve(
                User.with(
                    findUser.id,
                    findUser.name,
                    findUser.email,
                    findUser.username,
                    findUser.password,
                    findUser.type as UserTypes,
                    findUser.status as UserStatus,
                    findUser.createdAt,
                    findUser.updatedAt))
        } catch (error) {
            return null;
        }
    }

    public async findByFilter(filter: User): Promise<User[] | null> {
        throw new Error("Method not implemented.");
    }


    public async update(user: Partial<User>): Promise<User | GenericErrorDto> {

        if ((!user.id) && (!user.email)) {
            throw new Error("Email or UserId must be informed");
        } else { 
            let findUser: any = null;
            findUser = await this.findOneByEmail(user.email ? user.email : '');
            console.log(findUser);
            if (!findUser) {
                throw new Error("User not found");
            }

            const updateUser = await this.prisma.user.update({
                where: { email: findUser.email },
                data: user
            });

            return User.with(
                updateUser.id,
                updateUser.name,
                updateUser.email,
                updateUser.username,
                updateUser.password,
                updateUser.type as UserTypes,
                updateUser.status as UserStatus,
                updateUser.createdAt,
                updateUser.updatedAt
            );
        }
    }

    public async delete(id: string): Promise<boolean | GenericErrorDto> {
        throw new Error("Method not implemented.");
    }
    
}