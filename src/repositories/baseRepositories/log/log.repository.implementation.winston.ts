import { LogRepository } from "./log.repository";
import dayjs from "dayjs";
import { createLogger, format, transports } from 'winston';
import chalk from "chalk";

export class LogRepositoryImplementation implements LogRepository {
    private static instance: LogRepositoryImplementation;
    private myformat: any;
    private logMode: any;
    private transportArray: any;
    private logger: any;

    private constructor() {

        const { combine, timestamp, printf } = format;
        this.myformat = printf((info: any) => {
            let colorizedLevel;
            switch(info.level) {
              case 'info':
                colorizedLevel = chalk.blue(info.level.toUpperCase());
                break;
              case 'debug':
                colorizedLevel = chalk.yellow(info.level.toUpperCase());
                break;
              default:
                colorizedLevel = info.level.toUpperCase();
            }
            return `${chalk.gray(dayjs(info.timestamp).format('YYYY-MM-DD HH:mm'))} [${colorizedLevel}] ${info.message}`;
          });

        this.logMode = process.env.LOGMODE || 'CONSOLE';
        
        this.transportArray = [new transports.Console()];

        if (this.logMode === 'BOTH') {
            this.transportArray.push(new transports.File({
                filename: process.env.LOGFILE || 'logs/app.log'
            }));
        } else if (this.logMode === 'FILE') {
            this.transportArray = [new transports.File({
                filename: process.env.LOGFILE || 'logs/app.log'
            })];
        }

        // cria o log
        this.logger = createLogger({
            format: combine(
                timestamp(),
                this.myformat
            ),
            transports: this.transportArray
        });
    }

    public static build(): LogRepositoryImplementation {
        if (!LogRepositoryImplementation.instance) {
            LogRepositoryImplementation.instance = new LogRepositoryImplementation();
        }
        return LogRepositoryImplementation.instance;
    }

    public async createLog(type: string, data: string): Promise<void> {
        let loggerData = { message: data, level: type }
        this.logger.log(loggerData);
    }
}