export interface LogService {
    createLog(tag: string, idNumber: string | null, operation: string, message?: any): Promise<void>;
}