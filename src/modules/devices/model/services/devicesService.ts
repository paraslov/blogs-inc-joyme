import { jwtService } from '../../../common/services'
import { devicesQueryRepository } from '../repositories/devicesQueryRepository'

export const devicesService = {
  async checkAuthSessionByRefreshToken(userId: string, refreshToken: string) {
    const tokenData = await this.getTokenData(refreshToken)
    if (!tokenData) {
      return false
    }

    const hasAuthSession = await devicesQueryRepository.isAuthSessionExist(userId, tokenData.deviceId, tokenData?.iat)
    return hasAuthSession;
  },
  async getTokenData(refreshToken: string) {
    return jwtService.decodeToken(refreshToken)
  },
}
