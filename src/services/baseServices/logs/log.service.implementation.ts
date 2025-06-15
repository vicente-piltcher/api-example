import { LogRepositoryImplementation } from "../../../repositories/baseRepositories/log/log.repository.implementation.winston";
import { LogService } from "./log.service";

export class LogServiceImplementation implements LogService {
    private static instance: LogServiceImplementation;
    
    private constructor(readonly repository: LogRepositoryImplementation){
        this.repository = repository;
    }

    public static build(repository: LogRepositoryImplementation): LogServiceImplementation {
        if (!LogServiceImplementation.instance) {
            LogServiceImplementation.instance = new LogServiceImplementation(repository);
        }
        return LogServiceImplementation.instance;
    }

    public async createLog(tag: string, idNumber: string | null, operation: string, message?: any): Promise<void> {
        /* cria e formata a mensagem de log no padrao [TAG] [ID] => <idnumber> => [STATUS ou OPERACAO] {<dados da execução ou do erro>} */
        let logMessage = `[${tag}]`;
        if (idNumber !== null) {
            logMessage += ` [ID] => ${idNumber} =>`;
        }

        logMessage += ` [${operation}]`;

        if (message) {
            logMessage += ` ${JSON.stringify(message)}\n`;
        }
        this.repository.createLog('info', logMessage);
    }
}