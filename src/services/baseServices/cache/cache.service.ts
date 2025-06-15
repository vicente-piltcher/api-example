export interface AppCacheService {
    set(key: string, value: any, ttl?: number): boolean;
    get<T>(key: string): T | undefined;
    del(key: string): number;
    flushAll(): void;
    listAll(): any;
}