import { authSessionsCollection } from '../../../../app/config/db'
import { deviceMappers } from '../mappers/deviceMappers'

export const deviceQueryRepository = {
  async getDevices(userId: string) {
    const authSessions = await authSessionsCollection.find({ userId }).toArray()

    return authSessions.map(deviceMappers.mapSessionsToDevicesView)
  }
}
