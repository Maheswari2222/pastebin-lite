import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

type HashValue = Record<string, string>;

let redis: any;

if (!url || !token) {
  console.warn("⚠️ No Upstash credentials found. Using in-memory mock Redis.");

  const hashStore = new Map<string, HashValue>();

  redis = {
    async hgetall<T extends HashValue>(key: string): Promise<T | null> {
      return (hashStore.get(key) as T) ?? null;
    },

    async hincrby(key: string, field: string, amount: number) {
      const obj = hashStore.get(key) ?? {};
      const value = (Number(obj[field] ?? "0") || 0) + amount;
      obj[field] = String(value);
      hashStore.set(key, obj);
      return value;
    },

    async hset(key: string, value: HashValue) {
      const existing = hashStore.get(key) ?? {};
      hashStore.set(key, { ...existing, ...value });
      return "OK";
    },

    async del(key: string) {
      return hashStore.delete(key);
    },

    async exists(key: string) {
      return hashStore.has(key) ? 1 : 0;
    },
  };
} else {
  redis = new Redis({
    url,
    token,
  });
}

export { redis };
