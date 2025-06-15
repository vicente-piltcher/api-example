import { AppCacheRepositoryImplementation } from "../../../repositories/baseRepositories/cache/cache.repository.implementation.node.cache";
import { AppCacheService } from "./cache.service";

export class AppCacheServiceImplementation implements AppCacheService {
    private repository: AppCacheRepositoryImplementation;
    private static instance: AppCacheServiceImplementation;

    private constructor(){
        this.repository = AppCacheRepositoryImplementation.build();
    }
    
    public static build(): AppCacheServiceImplementation {
        if (!AppCacheServiceImplementation.instance) {
            AppCacheServiceImplementation.instance = new AppCacheServiceImplementation();
        }
        return AppCacheServiceImplementation.instance;
    }

    set(key: string, value: any, ttl?: number): boolean {
        return this.repository.set(key, value, ttl);
    }

    get<T>(key: string): T | undefined {
        return this.repository.get(key);
    }

    del(key: string): number {
        return this.repository.del(key);
    }

    flushAll(): void {
        this.repository.flushAll();
    }

    listAll() {
        const keys = this.repository.keys();
        const allValues = keys.map(key => ({ key, value: this.repository.get(key) }));
        return allValues;
    }

}