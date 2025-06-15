import { PrismaClient } from '@prisma/client';
import { UserRepositoryPrisma } from '../../repositories/baseRepositories/user/prisma/user.repository.mapper.prisma';
import { UserRepositoryImplementation } from '../../repositories/baseRepositories/user/user.repository.implementation';
import { UserServiceImplementation } from '../../services/baseServices/user/implementation/user.service.implementation';

const PRISMACLIENT = new PrismaClient();

export class UserServiceFactory {
    static createUserService() {
        const userRepositoryOrm = UserRepositoryPrisma.build(PRISMACLIENT);
        const userRepository = UserRepositoryImplementation.build(userRepositoryOrm);
        return UserServiceImplementation.build(userRepository);
    }
}