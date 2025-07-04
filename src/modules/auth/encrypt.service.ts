import bcrypt from "bcrypt"
const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS!))
}

const verifyPassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}

export const EncryptService = {
    hashPassword,
    verifyPassword
}