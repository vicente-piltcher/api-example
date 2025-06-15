import { User, UserTypes, UserStatus } from "../../../entities/users";
import { GenericErrorDto } from "../../../util/types/generic.types";
import { UserRepository } from "./user.repository";

export class UserRepositoryImplementation implements UserRepository {

    private constructor (readonly mapper: UserRepository) {
        this.mapper = mapper;
    }

    public static build (mapper: UserRepository) {
        return new UserRepositoryImplementation(mapper);
    }

    public async create(user: User): Promise<User | GenericErrorDto> {
        const newUser = await this.mapper.create(user);
        if (!newUser) {
            return Promise.reject({
                statusCode: 500,
                message: 'Error creating user'
            })
        }

        return Promise.resolve(newUser);
    }
    public async listAll(): Promise<User[] | null> {
        const findAll = await this.mapper.listAll();
        return Promise.resolve(findAll);
    }
    public async findOneById(id: string): Promise<User | null> {
        const findUser = await this.mapper.findOneById(id);
        return Promise.resolve(findUser);
    }
    public async findOneByEmail(email: string): Promise<User | null> {
        const findUser = await this.mapper.findOneByEmail(email);
        return Promise.resolve(findUser);
    }
    public async findByFilter(filter: User): Promise<User[] | null> {
        const findUser = await this.mapper.findByFilter(filter);
        return Promise.resolve(findUser);
    }
    public async update(user: Partial<User>): Promise<User | GenericErrorDto> {
        const updateUser = await this.mapper.update(user);
        return Promise.resolve(updateUser);
    }
    public async delete(id: string): Promise<boolean | GenericErrorDto> {
        throw new Error("Method not implemented.");
    }

}