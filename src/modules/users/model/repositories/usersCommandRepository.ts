import { usersCollection } from '../../../../app/config/db'
import { UserDbModel } from '../types/UserDbModel'
import { ObjectId } from 'mongodb'

export const usersCommandRepository = {
  async createUser(newUser: UserDbModel): Promise<string> {
    const createUserData = await usersCollection.insertOne(newUser)

    return createUserData.insertedId.toString()
  },
  async deleteUser(userId: string) {
    const deleteResult = await usersCollection.deleteOne({ _id: new ObjectId(userId)})

    return Boolean(deleteResult.deletedCount)
  }
}
