import { cryptService } from '../../../common/services'
import { jwtService } from '../../../common/services'
import { UserDataModel, UserDbModel, UserInputModel } from '../../../users'
import { ConfirmationInfoModel } from '../../../users'
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns'
import { authQueryRepository } from '../repositories/authQueryRepository'
import { authCommandRepository } from '../repositories/authCommandRepository'
import { emailManager } from '../../../common/managers/emailManager'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'

export const authService = {
  async checkUser(loginOrEmail: string, password: string) {
    const user = await authQueryRepository.getUserByLoginOrEmail(loginOrEmail)
    if (!user) {
      return false
    }

    const isPasswordValid = await cryptService.checkPassword(password, user.userData.passwordHash)

    if (!isPasswordValid) {
      return false
    }

    const token = await jwtService.createJWT(user)

    return token
  },
  async registerUser(payload: UserInputModel) {
    const { login, email, password } = payload
    const passwordHash = await cryptService.generateHash(password)

    const userData: UserDataModel = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    }
    const confirmationData: ConfirmationInfoModel = {
      confirmationCode: uuidv4(),
      confirmationCodeExpirationDate: add(new Date(), { hours: 1, minutes: 1 }),
      isConfirmed: false,
    }

    const newUserRegistration: UserDbModel = {
      userData,
      confirmationData,
    }

    const savedUserId = await authCommandRepository.registerUser(newUserRegistration)

    try {
      const mailInfo = await emailManager.sendRegistrationEmail(email, confirmationData.confirmationCode)
      console.log('@> Information::mailInfo: ', mailInfo)
    } catch (err) {
      console.error('@> Error::emailManager: ', err)
    }

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: null,
    }
  }
}
