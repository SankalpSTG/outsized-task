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

const register = async (data: RegisterType) => {
    const userRepository = AppDataSource.getRepository(User)

    let user = await userRepository.findOneBy({email: data.email})
    if(user) throw new BadRequestException(undefined, "account already exists")
    
    const otp = OtpService.generate(6)
    user = new User()
    user.name = data.name
    user.email = data.email
    user.phone = data.phone
    user.password = await EncryptService.hashPassword(data.password)
    user.verificationToken = await EncryptService.hashPassword(otp)
    user.verificationTokenExpiry = new Date(new Date().getTime() + VERIFICATION_TOKEN_EXPIRY_MS)
    user.role = data.role
    user = await userRepository.save(user)
    
    await SESService.sendEmail(data.email, "OTP to Email Verification", "Please use following OTP: " + otp)

    return {
        id: user.id,
        otp: "Sending OTP in response for testing purpose. OTP: " + otp
    }
}

const sendOtpForVerification = async (data: OtpForPasswordResetType) => {
    const userRepository = AppDataSource.getRepository(User)

    let user = await userRepository.findOneBy({email: data.email})
    if(!user) throw new BadRequestException()
    
    const otp = OtpService.generate(6)

    user.verificationToken = await EncryptService.hashPassword(otp)
    user.verificationTokenExpiry = new Date(new Date().getTime() + VERIFICATION_TOKEN_EXPIRY_MS)
    await userRepository.save(user)

    await SESService.sendEmail(data.email, "OTP to Email Verification", "Please use following OTP: " + otp)

    return {
        id: user.id,
        otp: "Sending OTP in response for testing purpose. OTP: " + otp
    }
}

const verifyOtp = async (data: VerifyUserType) => {
    const userRepository = AppDataSource.getRepository(User)

    let user = await userRepository.findOneBy({id: data.id})
    if(!user) throw new BadRequestException()
    
    await validateOtp(user, data.otp)
}


const verifyUser = async (data: VerifyUserType) => {
    const userRepository = AppDataSource.getRepository(User)

    let user = await userRepository.findOneBy({id: data.id})
    if(!user) throw new BadRequestException()
    
    if(user.emailVerified) return true
    
    await validateOtp(user, data.otp)

    user.verificationToken = null
    user.emailVerified = true
    await userRepository.save(user)
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
    const userRepository = AppDataSource.getRepository(User)
    
    let user = await userRepository.findOneBy({id: data.id})
    if(!user) throw new BadRequestException()
        
    await validateOtp(user, data.otp)
    
    user.verificationToken = null
    user.password = await EncryptService.hashPassword(data.password)
    user.emailVerified = true
    await userRepository.save(user)
}

const login = async (data: LoginType) => {
    const userRepository = AppDataSource.getRepository(User)

    let user = await userRepository.findOneBy({email: data.email})
    if(!user) throw new BadRequestException(undefined, "invalid credentials")

    const passwordMatch = await EncryptService.verifyPassword(data.password, user.password)
    if(!passwordMatch) throw new BadRequestException(undefined, "invalid credentials")
    
    if(!user.emailVerified) throw new BadRequestException(undefined, "account is not verified")
    
    const accessToken = JWTService.sign({
        id: user.id,
        role: user.role,
    }, process.env.ACCESS_TOKEN_SECRET!, 
    process.env.ACCESS_TOKEN_EXPIRY!)

    const refreshToken = JWTService.sign({
        id: user.id,
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