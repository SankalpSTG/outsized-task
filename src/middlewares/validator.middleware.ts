import { NextFunction, Request, Response } from "express";
import z from "zod";
import { BadRequestException } from "../misc/errors";

export const validate = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        throw new BadRequestException(result.error.issues)
    }
    req.body = result.data; // Use the parsed & typed data
    next();
  };
};