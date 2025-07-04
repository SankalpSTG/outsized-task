import {Request, response, Response} from "express"
import { RegisterType } from "./types/register"
import { AuthService } from "./auth.service"
import { Responses } from "../../misc/responses"
import { LoginType } from "./types/login"
import { OtpForPasswordResetType, PasswordResetType } from "./types/password-reset"
import { VerifyUserType } from "./types/verify-user"
import { GenerateAccessTokenType } from "./types/generate-access-token"

const register = async (req: Request, res: Response) => {
    const body = req.body as RegisterType
    const response = await AuthService.register(body)
    res.status(200).json(Responses.successResponse(response))
}

const login = async (req: Request, res: Response) => {
    const body = req.body as LoginType
    const response = await AuthService.login(body)
    res.status(200).json(Responses.successResponse(response))
}

const sendOtpForVerification = async (req: Request, res: Response) => {
    const body = req.body as OtpForPasswordResetType
    const response = await AuthService.sendOtpForVerification(body)
    res.status(200).json(Responses.successResponse(response))
}

const verifyUser = async (req: Request, res: Response) => {
    const body = req.body as VerifyUserType
    await AuthService.verifyUser(body)
    res.status(200).json(Responses.successResponse())
}

const verifyOtpForPasswordReset = async (req: Request, res: Response) => {
    const body = req.body as VerifyUserType
    await AuthService.verifyOtp(body)
    res.status(200).json(Responses.successResponse())
}

const updatePassword = async (req: Request, res: Response) => {
    const body = req.body as PasswordResetType
    await AuthService.updatePassword(body)
    res.status(200).json(Responses.successResponse())
}

const generateAccessToken = async (req: Request, res: Response) => {
    const body = req.body as GenerateAccessTokenType
    const response = await AuthService.generateAccessToken(body)
    res.status(200).json(Responses.successResponse(response))
}

export const AuthController = {
    register,
    login,
    sendOtpForVerification,
    verifyUser,
    verifyOtpForPasswordReset,
    updatePassword,
    generateAccessToken
}