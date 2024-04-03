import { authSessionsCollection } from '../../../../app/config/db'
import { devicesMappers } from '../mappers/devicesMappers'

export const devicesQueryRepository = {
  async getDevices(userId: string) {
    const authSessions = await authSessionsCollection.find({ userId }).toArray()

    return authSessions.map(devicesMappers.mapSessionsToDevicesView)
  },
  async isAuthSessionExist(userId: string, deviceId: string, iat?: number) {
    const authSession = await authSessionsCollection.findOne({
      userId,
      deviceId,
      iat,
    })

    return Boolean(authSession)
  },
}
