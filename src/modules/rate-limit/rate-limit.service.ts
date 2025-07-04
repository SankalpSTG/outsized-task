import { RedisConfig } from "../../config/redis.config"

const redis = RedisConfig.getRedis()
const fixedWindowSize = parseInt(process.env.FIXED_WINDOW_RATE_LIMITER_SIZE || "3600000")
const fixedWindowLimit = parseInt(process.env.FIXED_WINDOW_RATE_LIMITER_LIMIT || "0")

const limit = async (key: string) => {
    const date = Math.floor(new Date().getTime() / (1000 * fixedWindowSize))
    const redisKey = `${date}:${key}`
    
    const count = await redis.incr(redisKey)
    
    if (count === 1) {
        await redis.expire(redisKey, fixedWindowSize);
    }
    
    return count < fixedWindowLimit
}

export const RateLimitService = {
    limit
}