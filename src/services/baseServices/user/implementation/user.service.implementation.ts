import { User, UserTypes } from "../../../../entities/users";
import { UserRepositoryImplementation } from "../../../../repositories/baseRepositories/user/user.repository.implementation";
import { genericHashPassword } from "../../../../util/functions/generic.password.functions";
import { GenericReturnResult } from "../../../../util/genericReturnResult/genericReturnResult";
import { GenericErrorDto, GenericReturnResultDto } from "../../../../util/types/generic.types";
import { UserService, RegisterUserDto } from "../user.service";

export class UserServiceImplementation implements UserService {
    
    private constructor (readonly repository: UserRepositoryImplementation) {
        this.repository = repository;
    }
    
    public static build(repository: UserRepositoryImplementation) {
        return new UserServiceImplementation(repository);
    }

    public async list(): Promise<User[] | null> {
        const listAll = await this.repository.listAll();
        return listAll;
    }

    public async register(name: string, email: string, username: string, type: string, password: string): Promise<RegisterUserDto | GenericErrorDto> {
        let findUser: any = null;
        let result: any = {error: true, data: {statusCode: 500, message:'An unexpected error ocurred while creating user' }}

        try {
           findUser = await this.repository.findOneByEmail(email);
        } catch (error) {
            console.log(error);
            result.error = true;
            result.data = error;
        }


        if (findUser === null) {
            console.log("to aqui")
            const hashedPassword = await genericHashPassword(password, 10);
            console.log(hashedPassword)
            let createUser: any = null;
            let newUser: any = null;
            try {
                console.log('1')
                createUser = User.create(name, email, username, hashedPassword, type as UserTypes)
                console.log(createUser)
                newUser = await this.repository.create(createUser);
                console.log(newUser);
            } catch (error) {
                if (newUser && 'statusCode' in newUser) {
                    result.error = true;
                    result.data = newUser;
                } else {
                    result.error = true;
                    result.data = error;
                }
            }

            if (newUser && 'id' in newUser) {
                result.error = false;
                result.data = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    type: newUser.type,
                    status: newUser.status
                }
            }
        } else { 
            result.error = true;
            result.data = {
                statusCode: 400,
                message: `Error while registering`
            }
        } 
        return result.data;
    }

    public async update(id: string, name: string, email: string, username: string, password: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    public async delete(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    public async findOneById(id: string): Promise<User | null> {
        return await this.repository.findOneById(id);
    }
    public async findOneByEmail(email: string): Promise<User | null> {
        return await this.repository.findOneByEmail(email);
    }

    public async changePassword(email: string, actualPassword: string, newPassword: string): Promise<string | GenericReturnResultDto> {
        

        console.log(email,actualPassword,newPassword);

        if(!email || !actualPassword || !newPassword) {
            return await GenericReturnResult.throwReturn('BAD_REQUEST', 'Need to contain all data [email,actualPassword,newPassword]', {email,actualPassword,newPassword}, null);
        }
        // valida se o usuário existe
        let findUser = await this.repository.findOneByEmail(email);

        if (!findUser) {
            return await GenericReturnResult.throwReturn('NOT_FOUND', 'User not found', email, null);
        }

        const passwordHash = await genericHashPassword(actualPassword, 10);
        console.log(passwordHash)
        console.log(findUser.password)

        const newPasswordHash = await genericHashPassword(newPassword, 10);

        const data: Partial<User> = {
            email: findUser.email,
            password: newPasswordHash
        }

        const updateUser = await this.repository.update(data);

        if (updateUser) {
            return await GenericReturnResult.throwReturn('SUCCESS', 'Password changed with sucess', { email, actualPassword, newPassword }, { newPasswordHash });
        } else {
            return updateUser;
        }
    }
}