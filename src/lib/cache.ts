type CacheValue<T> = {
    value: T;
    expiresAt: number | null;
};

class Cache<T> {
    private cache: Map<string, CacheValue<T>>;

    constructor() {
        this.cache = new Map();
    }

    set(key: string, value: T, ttl?: number): void {
        const expiresAt = ttl ? Date.now() + ttl : null;
        this.cache.set(key, { value, expiresAt });
    }

    get(key: string): T | null {
        const cacheEntry = this.cache.get(key);

        if (!cacheEntry) {
            return null;
        }

        //validate that the token is not expired
        if (cacheEntry.expiresAt && cacheEntry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }

        return cacheEntry.value;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }
}

export default new Cache()
