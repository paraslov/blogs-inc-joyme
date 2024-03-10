import { UserInputModel } from '../types/UserInputModel'
import { usersCommandRepository } from '../repositories/usersCommandRepository'
import { cryptService } from '../../../common/services'
import { UserDbModel } from '../types/UserDbModel'
import { usersQueryRepository } from '../repositories/usersQueryRepository'

export const usersService = {
  async createUser(payload: UserInputModel) {
    const passwordHash = await cryptService.generateHash(payload.password)

    const newUser: UserDbModel = {
      login: payload.login,
      email: payload.email,
      passwordHash: passwordHash,
      createdAt: new Date().toISOString(),
    }

    return usersCommandRepository.createUser(newUser)
  },
  async deleteUser(userId: string) {
    const foundUser = await usersQueryRepository.getUserById(userId)

    if (!foundUser) {
      return false
    }

    return usersCommandRepository.deleteUser(userId)
  }
}
