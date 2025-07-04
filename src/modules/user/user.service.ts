import { AppDataSource } from "../../config/psql.config"
import { User } from "../../entities/user.entity"

const userRepository = AppDataSource.getRepository(User)

const createUser = async (partial: Partial<User>) => {
    const user = userRepository.create(partial)
    return await userRepository.save(user)
}

const updateVerificationToken = async (id: number, token: string, expiry: Date) => {
    await userRepository.update(id, {
        verificationToken: token,
        verificationTokenExpiry: expiry
    })
}

const setEmailVerified = async (id: number, verified: boolean) => {
    await userRepository.update(id, {
        verificationToken: null,
        emailVerified: verified
    })
}

const updatePassword = async (id: number, password: string, resetViaEmail: boolean) => {
    const updateObject: any = {
        verificationToken: null,
        password: password,
    }
    if(resetViaEmail){
        updateObject.emailVerified = true
    }

    await userRepository.update(id, updateObject)
}

const findOneByEmail = async (email: string) => {
    return await userRepository.findOneBy({email: email})
}

const findOneById = async (id: number) => {
    return await userRepository.findOneBy({id: id})
}

const updateUser = async (user: User) => {
    return await userRepository.save(user)
}

export const UserService = {
    findOneByEmail,
    updateUser,
    findOneById,
    createUser,
    updateVerificationToken,
    setEmailVerified,
    updatePassword
}