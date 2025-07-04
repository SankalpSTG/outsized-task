import { RedisConfig } from "../../config/redis.config"

const redis = RedisConfig.getRedis()
const fixedWindowSize = parseInt(process.env.FIXED_WINDOW_RATE_LIMITER_SIZE || "3600000")
const fixedWindowLimit = parseInt(process.env.FIXED_WINDOW_RATE_LIMITER_LIMIT || "0")

const limit = async (key: string) => {
    const blockKey = `blocked:${key}`
    const blocked = await redis.get<boolean>(blockKey)
    if(blocked) return true

    const date = Math.floor(new Date().getTime() / (1000 * fixedWindowSize))
    const limitKey = `${date}:${key}`
    
    const count = await redis.incr(limitKey)
    
    if (count === 1) {
        await redis.expire(limitKey, fixedWindowSize);
    }

    if(count > fixedWindowLimit * parseFloat(process.env.IP_BLACKLIST_LIMIT!)){
        await redis.set(blockKey, true)
    }
    
    return count >= fixedWindowLimit
}

export const RateLimitService = {
    limit
}