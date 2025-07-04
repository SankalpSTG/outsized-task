import {NextFunction, Request, Response} from "express"
import { BadRequestException, ForbiddenException, HttpException, TooManyRequestsException, UnAuthorizedException } from "../misc/errors"
import { JWTService } from "../modules/auth/jwt.service"
import { JWTSignInPayload, USER_ROLES } from "../modules/auth/constants"
import { RateLimitService } from "../modules/rate-limit/rate-limit.service"

export const RateLimiterMiddleware = () => {
    return async function(req: Request, res: Response, next: NextFunction) {
        const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
            req.socket?.remoteAddress ||
            req.ip;
        if(!ip) throw new BadRequestException(undefined, "unable to determine sender's ip")
        
        const isNotLimited = await RateLimitService.limit(ip)
        
        if(!isNotLimited) throw new TooManyRequestsException()

        next()
    }
}