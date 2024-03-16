import { usersCollection } from '../../../../app/config/db'
import { UserDbModel } from '../../../users'

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
}
