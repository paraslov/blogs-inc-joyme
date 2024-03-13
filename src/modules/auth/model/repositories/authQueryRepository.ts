import { usersCollection } from '../../../../app/config/db'
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
        { login: loginOrEmail },
        { email: loginOrEmail },
      ]
    }).toArray()

    if (users.length !== 1) {
      return false
    }

    return users[0]
  },
}
