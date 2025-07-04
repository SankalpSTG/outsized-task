import z from "zod";
import { USER_ROLES } from "../constants";

export const registerSchema = z.object({
  name: z.string().min(1, "name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "invalid phone number"),
  email: z.string().email("invalid email address"),
  password: z.string().min(6, "password must be at least 6 characters"),
  role: z.nativeEnum(USER_ROLES),
});

export type RegisterType = z.infer<typeof registerSchema>;