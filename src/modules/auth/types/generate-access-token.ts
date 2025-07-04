import z from "zod";

export const generateAccessTokenSchema = z.object({
  refreshToken: z.string().min(1, "invalid refresh token"),
});

export type GenerateAccessTokenType = z.infer<typeof generateAccessTokenSchema>;
