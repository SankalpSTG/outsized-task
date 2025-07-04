import {config} from "dotenv"
config()
import "reflect-metadata"
import express, { json } from "express"
import AuthRouter from "./modules/auth/auth.routes"
import { GlobalErrorHandler } from "./misc/errors"
import { RateLimiterMiddleware } from "./middlewares/rate-limit.middleware"
import ResourceRouter from "./modules/resource/resource.routes"
import ServerlessHttp from "serverless-http"
const app = express()
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

export const handler = ServerlessHttp(app, {
    request: true
})