import { JWTSignInPayload } from "../modules/auth/types/jwt";

declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTSignInPayload; // your decodedToken type
  }
}