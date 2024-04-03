import { jwtService } from '../../../common/services'
import { devicesQueryRepository } from '../repositories/devicesQueryRepository'
import { devicesCommandRepository } from '../repositories/devicesCommandRepository'

export const devicesService = {
  async checkAuthSessionByRefreshToken(userId: string, refreshToken: string) {
    const tokenData = await this.getTokenData(refreshToken)
    if (!tokenData) {
      return false
    }

    const authSession = await devicesQueryRepository.isAuthSessionExist(userId, tokenData.deviceId, tokenData?.iat)
    return authSession;
  },
  async deleteAllOtherSessions(userId: string, currentDeviceId: string) {
    const userDevices = await devicesQueryRepository.getDevices(userId)
    const userDevicesIdsWithoutCurrent = userDevices
      .map((deviceData) => deviceData.deviceId)
      .filter((deviceId) => deviceId !== currentDeviceId)

    return await devicesCommandRepository.deleteAllOtherSessions(userDevicesIdsWithoutCurrent)
  },
  async deleteSessionByDeviceId(deviceId: string) {
    return devicesCommandRepository.deleteSessionByDeviceId(deviceId)
  },
  async getTokenData(refreshToken: string) {
    return jwtService.getDataByTokenAndVerify(refreshToken, 'refresh')
  },
}