export interface LogRepository {
    createLog(type: string, data: string): void;
}