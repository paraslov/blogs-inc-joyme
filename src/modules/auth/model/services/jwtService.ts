import jwt from 'jsonwebtoken'
import { UserDbModel } from '../../../users'
import { ObjectId, WithId } from 'mongodb'

export const jwtService = {
  async createJWT(user: WithId<UserDbModel>) {
    return jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' })
  },
  async getUserIdByToken(token: string) {
    try {
      const res: any = jwt.verify(token, 'secret')

      return new ObjectId(res.userId)
    } catch (err) {
      return null
    }
  }
}
