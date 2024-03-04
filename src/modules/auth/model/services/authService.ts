import { cryptService } from '../../../common/services/cryptService'
import { authCommandRepository } from '../repositories/authCommandRepository'
import { jwtService } from './jwtService'

export const authService = {
  async checkUser(loginOrEmail: string, password: string) {
    const user = await authCommandRepository.getUser(loginOrEmail, password)
    if (!user) {
      return false
    }

    const isPasswordValid = await cryptService.checkPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return false
    }

    const token = await jwtService.createJWT(user)

    return token
  },
}
