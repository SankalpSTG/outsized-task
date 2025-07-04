export enum USER_ROLES {
    ADMIN = "admin",
    USER = "user",
    GUEST = "guest",
    NONE = "none",
}

export const UserRolesPrecedence = {
    "admin": 0,
    "user": 1,
    "guest": 2,
    "none": -1,
}

export const VERIFICATION_TOKEN_EXPIRY_MS = 900000