export interface AppCacheRepository {
    get(key: string): any;
    set(key: string, value: string, ttl: number): any;
    delete(key: string): any;
    flushAll(): any;
    listAll(): any;
}