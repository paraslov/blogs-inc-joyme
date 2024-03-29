import { sessionsCollection, usersCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { authMappers } from '../mappers/authMappers'

export const authQueryRepository = {
  async getUserMeModelById(userId: string) {
    const foundUser = await usersCollection.findOne({ _id: new ObjectId(userId) })

    return foundUser && authMappers.mapDbUserToMeModel(foundUser)
  },
  async getUserByLoginOrEmail(loginOrEmail: string) {
    const users = await usersCollection.find({
      $or: [
        { 'userData.login': loginOrEmail },
        { 'userData.email': loginOrEmail },
      ]
    }).toArray()

    if (users.length !== 1) {
      return false
    }

    return users[0]
  },
  async getUserByConfirmationCode(confirmationCode: string) {
    return await usersCollection.findOne({ 'confirmationData.confirmationCode': confirmationCode })
  },
  async getIsRefreshTokenValid(userId: string, refreshToken: string) {
    const userSession = await sessionsCollection.findOne({ userId })

    if (!userSession) {
      return true
    }

    return !userSession.refreshTokensBlackList.includes(refreshToken)
  }
}
