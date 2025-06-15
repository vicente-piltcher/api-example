import { LogRepositoryImplementation } from "../../repositories/baseRepositories/log/log.repository.implementation.winston";
import { LogServiceImplementation } from "../../services/baseServices/logs/log.service.implementation";

export class LogServiceFactory {
    private constructor(){};
    public static build() {
        const repository: LogRepositoryImplementation = LogRepositoryImplementation.build();
        return LogServiceImplementation.build(repository);
    }
}