import NodeCache from 'node-cache';

export class AppCacheRepositoryImplementation {
    private static instance: AppCacheRepositoryImplementation;
    private cache: NodeCache;

    private constructor() {
        this.cache = new NodeCache({ stdTTL: 0, checkperiod: 60 });
    }

    public static build(): AppCacheRepositoryImplementation {
        if (!AppCacheRepositoryImplementation.instance) {
            AppCacheRepositoryImplementation.instance = new AppCacheRepositoryImplementation();
        }
        return AppCacheRepositoryImplementation.instance;
    }

    // Métodos para manipular o cache
    public set(key: string, value: any, ttl?: number): boolean {
        return this.cache.set(key, value, ttl ?? 0);
    }

    public get<T>(key: string): T | undefined {
        return this.cache.get<T>(key);
    }

    public del(key: string): number {
        return this.cache.del(key);
    }

    public flushAll(): void {
        this.cache.flushAll();
    }

    public keys() {
        return this.cache.keys();
    }

}