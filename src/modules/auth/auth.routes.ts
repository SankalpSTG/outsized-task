import { Router } from "express";
import { validate } from "../../middlewares/validator.middleware";
import { registerSchema } from "./types/register";
import { AuthController } from "./auth.controller";
import { loginSchema } from "./types/login";
import { verifyUserSchema } from "./types/verify-user";
import { otpForPasswordResetSchema, passwordResetSchema } from "./types/password-reset";
import { generateAccessTokenSchema } from "./types/generate-access-token";

const AuthRouter = Router()

AuthRouter.post("/register", validate(registerSchema), AuthController.register)
AuthRouter.post("/login", validate(loginSchema), AuthController.login)
AuthRouter.post("/user/verify", validate(verifyUserSchema), AuthController.verifyUser)
AuthRouter.post("/password-reset/otp", validate(otpForPasswordResetSchema), AuthController.sendOtpForVerification)
AuthRouter.post("/password-reset/validate", validate(verifyUserSchema), AuthController.verifyOtpForPasswordReset)
AuthRouter.post("/password-reset", validate(passwordResetSchema), AuthController.updatePassword)
AuthRouter.post("/access-token", validate(generateAccessTokenSchema), AuthController.generateAccessToken)

export default AuthRouter