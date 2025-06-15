import { User } from "@prisma/client";
import { GenericErrorDto, GenericReturnResultDto } from "../../../util/types/generic.types";

export type RegisterUserDto = {
    id: string,
    name: string,
    email: string,
    status: string,
    type: string
}

// Define o diretório de métodos que implementam os use cases de usuário
export interface UserService {
    list(): Promise<User[] | null>;
    register(name: string, email: string, type: string, username: string, password: string): Promise<RegisterUserDto | GenericErrorDto>;
    update(id: string, name: string, email: string, username: string, password: string): Promise<string>;
    delete(id: string): Promise<string>;
    findOneById(id: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    changePassword(email: string, actualPassword: string, newPassword: string): Promise<string | GenericReturnResultDto>;
}