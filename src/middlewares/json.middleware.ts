import {NextFunction, Request, Response} from "express"

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