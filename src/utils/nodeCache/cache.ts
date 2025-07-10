import NodeCache from 'node-cache';

export class CacheManager {
  private static cache = new NodeCache({ stdTTL: 900 });

  static get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  static set<T>(key: string, value: T): boolean {
    return this.cache.set(key, value);
  }

  static del(key: string): void {
    if (this.cache.has(key)) {
      this.cache.del(key);
    }
  }


  static flush(): void {
    this.cache.flushAll();
  }
}
