import {NextFunction, Request, Response} from "express"
import { ForbiddenException, HttpException, UnAuthorizedException } from "../misc/errors"
import { JWTService } from "../modules/auth/jwt.service"
import { USER_ROLES, UserRolesPrecedence } from "../modules/auth/constants"
import { JWTSignInPayload } from "../modules/auth/types/jwt"

export const AuthMiddleware = (role: USER_ROLES, exact: boolean) => {
    return async function(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        if(!authHeader) throw new UnAuthorizedException()
        const chunk = authHeader.split(" ")
        if(chunk.length < 2) throw new UnAuthorizedException()
        const token = chunk[1]

        const response = JWTService.verify<JWTSignInPayload>(token, process.env.ACCESS_TOKEN_SECRET!)
        if(!response) throw new UnAuthorizedException()
        if(role === USER_ROLES.NONE) throw new ForbiddenException()
        if(exact && response.role != role) throw new ForbiddenException()
        if(UserRolesPrecedence[role] < (UserRolesPrecedence as any)[response.role]) throw new ForbiddenException()
        req.user = response

        next()
    }
}