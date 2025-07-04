# Outsized Task

This repository contains code for task given by Outsized.

You can test the APIs using Postman. I have attached a postman json export file in this repository. You can use it to import Postman APIs.

I have also deployed this app on AWS Lambda. You can access it here: 

## Setup

1. Move the `.env.example` file to `.env` and add values for each key
2. I have used Upstash to provide free redis cluster & neon for a free postgres database. You can use those services to get credentials to be substituted in `.env`.
3. Run `npm install`
4. Run `npm run dev` this should run `tsx` in watch mode.

## Architecture & System Design
### Modules
1. The application is split into modules similar to Nest.js
2. Services related to auth (jwt, user, encrypt, otp) lie in the auth module. 
3. There is an additional module called `resource` which is just to test RBAC.

### Database
1. PostgreSQL database has been used for storing user data.
2. TypeORM has been used as ORM for Postgres.
2. Redis is used for rate limiting, can be further used for caching.

### Rate Limiting
1. The entire app is IP rate limited using a custom global middleware. 
2. This employs Redis for saving entries. 
3. Code for inclusion of this can be found in the `index.ts` file.
4. Comment the line `app.use(app.use(RateLimiterMiddleware()))` to disable rate limiting.
5. I have implemented Fixed Window rate limiting. Furthermore we can implement other strategies like Sliding Window and Token Bucket using Strategy Design Pattern. However for current usecase, I've kept the code short and functional.

### Error Handling
1. There is a global error handler which catches exceptions and throws appropriate error.
2. Custom Exceptions are created for different types of error.

## API Endpoints
APIs should be called in the exact order to mimic a happy use case.
1. `/auth/register` Register user
2. `/auth/user/verify` Verify user
3. `/auth/login` Login
4. `/auth/password-reset/otp` Send OTP to Reset User Password
5. `/auth/password-reset/validate` Validate OTP submitted by User
6. `/auth/password-reset` Validate OTP & Update Password
7. `/auth/access-token` Generate Access Token using Refresh Token

8. `/resource/admin` Test API to Access resouces for Admin
9. `/resource/guest` Test API to Access resouces for Guest
10. `/resource/user` Test API to Access resouces for User

## Deployment
1. The application is deployed on AWS Lambda. You can use following url: 