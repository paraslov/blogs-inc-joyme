import jwt from 'jsonwebtoken'
import { UserDbModel } from '../../users'
import { WithId } from 'mongodb'
import { AppSettings } from '../../../app/appSettings'

export const jwtService = {
  async createAccessToken(user: WithId<UserDbModel>) {
    if (!AppSettings.ACCESS_JWT_SECRET) {
      return false
    }

    return jwt.sign({ userId: user._id }, AppSettings.ACCESS_JWT_SECRET, { expiresIn: AppSettings.ACCESS_JWT_EXPIRES })
  },
  async createRefreshToken(user: WithId<UserDbModel>) {
    if (!AppSettings.REFRESH_JWT_SECRET) {
      return false
    }

    return jwt.sign({ userId: user._id }, AppSettings.REFRESH_JWT_SECRET, { expiresIn: AppSettings.REFRESH_JWT_EXPIRES })
  },
  async createTokenPair(user: WithId<UserDbModel>) {
    const accessToken = await this.createAccessToken(user)
    const refreshToken = await this.createRefreshToken(user)

    return { accessToken, refreshToken }
  },
  async getUserIdByToken(token: string, secretType: 'access' | 'refresh' = 'access'): Promise<string | null> {
    const secret = secretType === 'access' ? AppSettings.ACCESS_JWT_SECRET : AppSettings.REFRESH_JWT_SECRET

    if (!secret) {
      return null
    }

    try {
      const res: any = jwt.verify(token, secret)

      return res.userId
    } catch (err) {
      return null
    }
  }
}
