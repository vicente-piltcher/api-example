import { User } from "../../../entities/users";
import { GenericErrorDto } from "../../../util/types/generic.types";

export interface UserRepository {
    create(user: User): Promise<User | GenericErrorDto>;
    listAll(): Promise<User[] | null>;
    findOneById(id: string): Promise<User | null>;
    findOneByEmail(email: string): Promise<User | null>;
    findByFilter(filter: User): Promise<User[] | null>;
    update(user: Partial<User>): Promise<User | GenericErrorDto>;
    delete(id: string): Promise<boolean | GenericErrorDto>;
}