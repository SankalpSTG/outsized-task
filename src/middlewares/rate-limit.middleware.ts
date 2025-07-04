import {NextFunction, Request, Response} from "express"
import { BadRequestException, TooManyRequestsException } from "../misc/errors"
import { RateLimitService } from "../modules/rate-limit/rate-limit.service"

export const RateLimiterMiddleware = () => {
    return async function(req: Request, res: Response, next: NextFunction) {
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
            req.socket?.remoteAddress ||
            req.ip;
        if(!ip) throw new BadRequestException(undefined, "unable to determine sender's ip")
        
        const isLimited = await RateLimitService.limit(ip)
        
        if(isLimited) throw new TooManyRequestsException()

        next()
    }
}