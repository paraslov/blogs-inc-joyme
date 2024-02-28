import { usersCollection } from '../../../../app/config/db'
import { UserDbModel } from '../types/UserDbModel'

export const usersCommandRepository = {
  async createUser(newUser: UserDbModel): Promise<string> {
    const createUserData = await usersCollection.insertOne(newUser)

    return createUserData.insertedId.toString()
  },
}
