import {config} from "dotenv"
config()
import "reflect-metadata"
import express, { json, NextFunction } from "express"
import AuthRouter from "./modules/auth/auth.routes"
import { GlobalErrorHandler } from "./misc/errors"
import { RateLimiterMiddleware } from "./middlewares/rate-limit.middleware"
import ResourceRouter from "./modules/resource/resource.routes"
import ServerlessHttp from "serverless-http"
import { CustomJSONMiddleware } from "./middlewares/json.middleware"
import {Request, Response} from "express"
import { AppDataSource } from "./config/psql.config"

const app = express()
app.use(CustomJSONMiddleware())
app.use(json())
app.use(RateLimiterMiddleware())

app.use("/auth", AuthRouter)
app.use("/resource", ResourceRouter)

app.get("/", (req, res) => {
    res.json({
        message: "Hello from Outsized"
    })
})

app.use(GlobalErrorHandler)

if(process.env.ENVIRONMENT == "development"){
    app.listen(4000, () => {
        console.log("Hello")
    })
}

export const handler = ServerlessHttp(async (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!AppDataSource.isInitialized) await AppDataSource.initialize()
        return app(req, res)
    }catch(error){
        console.error("DB init failed:", error)
        res.statusCode = 500
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({ message: "Database initialization failed" }))
    }
}, {
    request: true
})