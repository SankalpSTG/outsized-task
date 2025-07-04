import {NextFunction, Request, Response} from "express"
import { BadRequestException, TooManyRequestsException } from "../misc/errors"
import { RateLimitService } from "../modules/rate-limit/rate-limit.service"

export const CustomJSONMiddleware = () => {
    return async function(req: Request, res: Response, next: NextFunction) {
        try{
            req.body = JSON.parse(req.body)
        }catch(_){

        }finally{
            next()
        }
    }
}