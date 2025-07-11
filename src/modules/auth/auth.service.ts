import { AppDataSource } from "../../config/psql.config";
import { User } from "../../entities/user.entity";
import { BadRequestException, UnAuthorizedException } from "../../misc/errors";
import { SESService } from "../../services/aws/ses/ses.service";
import { VERIFICATION_TOKEN_EXPIRY_MS } from "./constants";
import { EncryptService } from "./encrypt.service";
import { JWTService } from "./jwt.service";
import { OtpService } from "./otp.service";
import { GenerateAccessTokenType } from "./types/generate-access-token";
import { JWTSignInPayload } from "./types/jwt";
import { LoginType } from "./types/login";
import { OtpForPasswordResetType, PasswordResetType } from "./types/password-reset";
import { RegisterType } from "./types/register";
import { VerifyUserType } from "./types/verify-user";
import { UserService } from "../user/user.service";

const register = async (data: RegisterType) => {

    let user = await UserService.findOneByEmail(data.email)
    if(user) throw new BadRequestException(undefined, "account already exists")
    
    const otp = OtpService.generate(6)
    user = await UserService.createUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: await EncryptService.hashPassword(data.password),
        verificationToken: await EncryptService.hashPassword(otp),
        verificationTokenExpiry: new Date(new Date().getTime() + VERIFICATION_TOKEN_EXPIRY_MS),
        role: data.role
    })
    
    await SESService.sendEmail(data.email, "OTP to Email Verification", "Please use following OTP: " + otp)

    return {
        id: user.id,
        otp: "Sending OTP in response for testing purpose. OTP: " + otp
    }
}

const sendOtpForVerification = async (data: OtpForPasswordResetType) => {
    let user = await UserService.findOneByEmail(data.email)
    if(!user) throw new BadRequestException()
    
    const otp = OtpService.generate(6)

    const hashedToken = await EncryptService.hashPassword(otp)
    const expiry = new Date(new Date().getTime() + VERIFICATION_TOKEN_EXPIRY_MS)
    
    await UserService.updateVerificationToken(user.id, hashedToken, expiry)

    await SESService.sendEmail(data.email, "OTP to Email Verification", "Please use following OTP: " + otp)

    return {
        id: user.id,
        otp: "Sending OTP in response for testing purpose. OTP: " + otp
    }
}

const verifyOtp = async (data: VerifyUserType) => {
    let user = await UserService.findOneById(data.id)
    if(!user) throw new BadRequestException()
    
    await validateOtp(user, data.otp)
}


const verifyUser = async (data: VerifyUserType) => {
    let user = await UserService.findOneById(data.id)
    if(!user) throw new BadRequestException()
    
    if(user.emailVerified) return true
    
    await validateOtp(user, data.otp)

    await UserService.setEmailVerified(user.id, true)
}

const validateOtp = async (user: User, otp: string) => {
    if(user.verificationToken == null){
        throw new BadRequestException()
    }
    const otpMatch = await EncryptService.verifyPassword(otp, user.verificationToken!)
    if(!otpMatch) throw new BadRequestException(undefined, "invalid otp")
    
    if(user.verificationTokenExpiry.getTime() < new Date().getTime()) throw new BadRequestException(undefined, "invalid otp")
}

const updatePassword = async (data: PasswordResetType) => {
    let user = await UserService.findOneById(data.id)
    if(!user) throw new BadRequestException()
        
    await validateOtp(user, data.otp)
    
    const passwordHash = await EncryptService.hashPassword(data.password)
    await UserService.updatePassword(data.id, passwordHash, true)
}

const login = async (data: LoginType) => {
    let user = await UserService.findOneByEmail(data.email)
    if(!user) throw new BadRequestException(undefined, "invalid credentials")

    const passwordMatch = await EncryptService.verifyPassword(data.password, user.password)
    if(!passwordMatch) throw new BadRequestException(undefined, "invalid credentials")
    
    if(!user.emailVerified) throw new BadRequestException(undefined, "account is not verified")
    
    const accessToken = JWTService.sign({
        userId: user.id,
        role: user.role,
    }, process.env.ACCESS_TOKEN_SECRET!, 
    process.env.ACCESS_TOKEN_EXPIRY!)

    const refreshToken = JWTService.sign({
        userId: user.id,
    }, process.env.REFRESH_TOKEN_SECRET!, 
    process.env.REFRESH_TOKEN_EXPIRY!)

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

const generateAccessToken = async (data: GenerateAccessTokenType) => {
    const payload = JWTService.verify<JWTSignInPayload>(data.refreshToken, process.env.REFRESH_TOKEN_SECRET!)

    if(!payload) throw new UnAuthorizedException()

    const userRepository = AppDataSource.getRepository(User)

    let user = await userRepository.findOneBy({id: payload.userId, role: payload.role})
    if(!user) throw new UnAuthorizedException()
    if(!user.emailVerified) throw new UnAuthorizedException()
    
    const accessToken = JWTService.sign({
        id: user.id,
        role: user.role,
    }, process.env.ACCESS_TOKEN_SECRET!, 
    process.env.ACCESS_TOKEN_EXPIRY!)

    return {
        accessToken: accessToken,
    }
}

export const AuthService = {
    register,
    login,
    verifyOtp,
    verifyUser,
    sendOtpForVerification,
    updatePassword,
    generateAccessToken
}