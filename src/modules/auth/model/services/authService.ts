import { cryptService, jwtService } from '../../../common/services'
import { ConfirmationInfoModel, UserDataModel, UserDbModel, UserInputModel } from '../../../users'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'
import { authQueryRepository } from '../repositories/authQueryRepository'
import { authCommandRepository } from '../repositories/authCommandRepository'
import { emailManager } from '../../../common/managers/emailManager'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import {
  ErrorMessageHandleResult,
  errorMessagesHandleService
} from '../../../common/services/errorMessagesHandleService'
import { ResultToRouter } from '../../../common/types'
import { operationsResultService } from '../../../common/services'

export const authService = {
  async createTokenPair(loginOrEmail: string, password: string) {
    const user = await authQueryRepository.getUserByLoginOrEmail(loginOrEmail)
    if (!user) {
      return false
    }

    const isPasswordValid = await cryptService.checkPassword(password, user.userData.passwordHash)

    if (!isPasswordValid) {
      return false
    }

    const { accessToken, refreshToken } = await jwtService.createTokenPair(user)

    if (!accessToken || !refreshToken) {
      return false
    }

    return { accessToken, refreshToken }
  },
  async updateTokenPair(refreshToken: string) {
    const userId = await jwtService.getUserIdByToken(refreshToken, 'refresh')
    const user = userId && await authQueryRepository.getUserMeModelById(userId)

    if (!userId || !user) {
      return operationsResultService.generateResponse(ResultToRouterStatus.NOT_AUTHORIZED)
    }

    const isRefreshTokenValid = await authQueryRepository.getIsRefreshTokenValid(userId, refreshToken)
    const userFromDb = await authQueryRepository.getUserByLoginOrEmail(user.email)
    if (!isRefreshTokenValid || !userFromDb) {
      return operationsResultService.generateResponse(ResultToRouterStatus.NOT_AUTHORIZED)
    }


    const { accessToken, refreshToken: updatedRefreshToken } = await jwtService.createTokenPair(userFromDb)

    if (!accessToken || !updatedRefreshToken) {
      return operationsResultService.generateResponse(ResultToRouterStatus.NOT_AUTHORIZED)
    }

    await authCommandRepository.addRefreshTokenToBlackList(userId, refreshToken)

    return operationsResultService.generateResponse(
      ResultToRouterStatus.SUCCESS,
      { accessToken, refreshToken: updatedRefreshToken },
    )
  },
  async logoutUser(refreshToken: string) {
    const userId = await jwtService.getUserIdByToken(refreshToken, 'refresh')
    const user = userId && await authQueryRepository.getUserMeModelById(userId)

    if (!userId || !user) {
      return {
        status: ResultToRouterStatus.NOT_AUTHORIZED,
        data: null,
      }
    }

    const isRefreshTokenValid = await authQueryRepository.getIsRefreshTokenValid(userId, refreshToken)

    if (!isRefreshTokenValid) {
      return {
        status: ResultToRouterStatus.NOT_AUTHORIZED,
        data: null,
      }
    }

    await authCommandRepository.addRefreshTokenToBlackList(userId, refreshToken)

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: null,
    }
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
      confirmationCodeExpirationDate: add(new Date(), {
        hours: 1,
        minutes: 1,
      }),
      isConfirmed: false,
    }

    const newUserRegistration: UserDbModel = {
      userData,
      confirmationData,
    }

    await authCommandRepository.registerUser(newUserRegistration)

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
  },
  async confirmUser(confirmationCode: string): Promise<ResultToRouter<ErrorMessageHandleResult | null>> {
    const userToConfirm = await authQueryRepository.getUserByConfirmationCode(confirmationCode)

    if (!userToConfirm || userToConfirm.confirmationData.confirmationCode !== confirmationCode) {
      return {
        status: ResultToRouterStatus.BAD_REQUEST,
        data: errorMessagesHandleService({ message: 'Incorrect verification code', field: 'code' }),
      }
    }
    if (userToConfirm.confirmationData.isConfirmed) {
      return {
        status: ResultToRouterStatus.BAD_REQUEST,
        data: errorMessagesHandleService({ message: 'Registration was already confirmed', field: 'code' }),
      }
    }
    if (userToConfirm.confirmationData.confirmationCodeExpirationDate < new Date()) {
      return {
        status: ResultToRouterStatus.BAD_REQUEST,
        data: errorMessagesHandleService({ message: 'Confirmation code expired', field: 'code' }),
      }
    }

    const confirmationResult = await authCommandRepository.confirmUser(confirmationCode)
    if (!confirmationResult) {
      return {
        status: ResultToRouterStatus.BAD_REQUEST,
        data: errorMessagesHandleService({ message: 'Ups! Something goes wrong...', field: 'code' }),
      }
    }

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: null,
    }
  },
  async resendConfirmationCode(email: string) {
    const user = await authQueryRepository.getUserByLoginOrEmail(email)

    if (!user) {
      return {
        status: ResultToRouterStatus.BAD_REQUEST,
        data: errorMessagesHandleService({ message: 'You have not registered yet', field: 'email' }),
      }
    }
    if (user.confirmationData.isConfirmed) {
      return {
        status: ResultToRouterStatus.BAD_REQUEST,
        data: errorMessagesHandleService({ message: 'Registration was already confirmed', field: 'email' }),
      }
    }
    // if (user.confirmationData.confirmationCodeExpirationDate > new Date()) {
    //   return {
    //     status: ResultToRouterStatus.BAD_REQUEST,
    //     data: errorMessagesHandleService({ message: 'Confirmation code is not expired yet. Check your email', field: 'code' }),
    //   }
    // }

    const updatedUser: UserDbModel = {
      ...user,
      confirmationData: {
        ...user.confirmationData,
        confirmationCode: uuidv4(),
        confirmationCodeExpirationDate: add(new Date(), {
          hours: 1,
          minutes: 1,
        }),
      },
    }

    await authCommandRepository.updateUser({ 'userData.email': email }, updatedUser)

    try {
      const mailInfo = await emailManager.resendRegistrationEmail(email, updatedUser.confirmationData.confirmationCode)
      console.log('@> Information::mailInfo: ', mailInfo)
    } catch (err) {
      console.error('@> Error::emailManager: ', err)
    }

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: null,
    }
  },
}
