import { usersQueryRepository } from '../../../users'
import { cryptService } from '../../../common/services/cryptService'
import { usersCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'

export const authService = {
  async checkUser(loginOrEmail: string, password: string) {
    const user = await usersQueryRepository.getUsers({
        searchEmailTerm: loginOrEmail,
        searchLoginTerm: loginOrEmail,
      })

    const userId = user.items?.[0]?.id
    const userFromDb = await usersCollection.findOne({ _id: new ObjectId(userId) })

    if (!userFromDb) {
      return false
    }

    const isPasswordValid = await cryptService.checkPassword(password, userFromDb.passwordHash)

    return isPasswordValid
  },
}
