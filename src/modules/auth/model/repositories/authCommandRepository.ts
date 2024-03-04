import { usersCollection } from '../../../../app/config/db'

export const authCommandRepository = {
  async getUser(loginOrEmail: string, password: string) {
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
  }
}
