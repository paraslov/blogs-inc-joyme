import { usersCollection } from '../../../../app/config/db'
import { UserDbModel } from '../../../users'

export const authCommandRepository = {
  async registerUser(newUserRegistration: UserDbModel) {
    const result = await usersCollection.insertOne(newUserRegistration)

    return result.insertedId.toString()
  },
}
