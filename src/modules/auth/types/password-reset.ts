import z from "zod";
import { USER_ROLES } from "../constants";

export const otpForPasswordResetSchema = z.object({
  email: z.string().email("invalid email address"),
});

export type OtpForPasswordResetType = z.infer<typeof otpForPasswordResetSchema>;

export const passwordResetSchema = z.object({
    id: z.number().min(1, "id is required"),
    otp: z.string().min(6, "otp is required"),
    password: z.string().min(6, "password must be at least 6 characters"),
});

export type PasswordResetType = z.infer<typeof passwordResetSchema>;