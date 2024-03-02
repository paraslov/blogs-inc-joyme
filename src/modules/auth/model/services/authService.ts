import { cryptService } from '../../../common/services/cryptService'
import { authCommandRepository } from '../repositories/authCommandRepository'

export const authService = {
  async checkUser(loginOrEmail: string, password: string) {
    const userPasswordHash = await authCommandRepository.getUserPasswordHash(loginOrEmail, password)

    if (!userPasswordHash) {
      return false
    }

    const isPasswordValid = await cryptService.checkPassword(password, userPasswordHash)

    return isPasswordValid
  },
}
