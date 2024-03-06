import { authCommandRepository } from '../repositories/authCommandRepository'
import { cryptService } from '../../../common/services'
import { jwtService } from '../../../common/services'

export const authService = {
  async checkUser(loginOrEmail: string, password: string) {
    const user = await authCommandRepository.getUser(loginOrEmail)
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
