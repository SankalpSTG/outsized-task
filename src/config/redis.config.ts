import { Redis } from '@upstash/redis'
const getRedis = () => new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
})

export const RedisConfig = {
    getRedis
}