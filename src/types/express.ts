import { JWTSignInPayload } from "../modules/auth/constants";

declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTSignInPayload; // your decodedToken type
  }
}