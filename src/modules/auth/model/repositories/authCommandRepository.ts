import { authSessionsCollection, usersCollection } from '../../../../app/config/db'
import { UserDbModel } from '../../../users'
import { AuthSessionsDbModel } from '../types/AuthSessionsDbModel'

export const authCommandRepository = {
  async registerUser(newUserRegistration: UserDbModel) {
    const result = await usersCollection.insertOne(newUserRegistration)

    return result.insertedId.toString()
  },
  async updateUser(filter: any, updateUser: UserDbModel) {
    const result = await usersCollection.updateOne(
      filter,
      { $set: updateUser },
    )

    return Boolean(result.modifiedCount === 1)
  },
  async confirmUser(confirmationCode: string) {
    const result = await usersCollection.updateOne(
      { 'confirmationData.confirmationCode': confirmationCode },
      { $set: { 'confirmationData.isConfirmed': true } },
    )

    return Boolean(result.modifiedCount === 1)
  },
  async addRefreshTokenToBlackList(userId: string, refreshToken: string) {
    let result
    const userSession = await authSessionsCollection.findOne({ userId })

    // if (!userSession?.refreshTokensBlackList) {
    //   result = await authSessionsCollection.insertOne({ userId, refreshTokensBlackList: [refreshToken] })
    //   return Boolean(result.insertedId.toString())
    // } else if (userSession.refreshTokensBlackList) {
    //   result = await authSessionsCollection.updateOne({ userId }, { $push: { refreshTokensBlackList: refreshToken } })
    //   return Boolean(result.matchedCount)
    // }

    return true
  },
  async createAuthSession(authSession: AuthSessionsDbModel) {
    const result = await authSessionsCollection.insertOne(authSession)

    return result.insertedId
  },
}
