import z from "zod";
import { USER_ROLES } from "../constants";

export const verifyUserSchema = z.object({
  id: z.number().min(1, "id is required"),
  otp: z.string().min(6, "otp is required"),
});

export type VerifyUserType = z.infer<typeof verifyUserSchema>;