import { authSessionsCollection } from '../../../../app/config/db'
import { devicesMappers } from '../mappers/devicesMappers'

export const devicesQueryRepository = {
  async getDevices(userId: string) {
    const authSessions = await authSessionsCollection.find({ userId }).toArray()
    const devices = authSessions.map(devicesMappers.mapSessionsToDevicesView)

    return devices
  },
  async getAuthSessionByDeviceId(deviceId: string) {
    const authSession = await authSessionsCollection.findOne({ deviceId })

    return authSession
  },
  async isAuthSessionExist(userId: string, deviceId: string, iat?: number) {
    const authSession = await authSessionsCollection.findOne({
      userId,
      deviceId,
      iat,
    })

    return authSession
  },
}
