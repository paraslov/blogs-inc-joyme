import { authSessionsCollection, UsersMongooseModel } from '../../../../app/config/db'
import { UserDbModel } from '../../../users'
import { AuthSessionsDbModel } from '../types/AuthSessionsDbModel'

export const authCommandRepository = {
  async registerUser(newUserRegistration: UserDbModel) {
    const result = await UsersMongooseModel.create(newUserRegistration)

    return result._id.toString()
  },
  async updateUser(filter: any, updateUser: UserDbModel) {
    const result = await UsersMongooseModel.updateOne(filter, updateUser)

    return Boolean(result.modifiedCount === 1)
  },
  async confirmUser(confirmationCode: string) {
    const result = await UsersMongooseModel.updateOne(
      { 'confirmationData.confirmationCode': confirmationCode },
      { 'confirmationData.isConfirmed': true },
    )

    return Boolean(result.modifiedCount === 1)
  },
  async createAuthSession(authSession: AuthSessionsDbModel) {
    const result = await authSessionsCollection.insertOne(authSession)

    return result.insertedId
  },
  async updateAuthSession(userId: string, deviceId: string, iat: number) {
    const result = await authSessionsCollection.updateOne({
      userId,
      deviceId,
    },
      {
        $set: {
          iat,
        }
      })

    return Boolean(result.modifiedCount)
  },
  async deleteAuthSession(userId: string, deviceId: string, iat: number) {
    const result = await authSessionsCollection.deleteOne({
      userId,
      deviceId,
      iat,
    })

    return Boolean(result.deletedCount)
  }
}
