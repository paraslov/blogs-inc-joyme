import { authSessionsCollection } from '../../../../app/config/db'

export const devicesCommandRepository = {
  async deleteAllOtherSessions(userDevicesIdsWithoutCurrent: string[]) {
    const result = await authSessionsCollection.deleteMany({
      deviceId: { $in: userDevicesIdsWithoutCurrent },
    })

    return result.deletedCount
  },

  async deleteSessionByDeviceId(deviceId: string) {
    const result = await authSessionsCollection.deleteOne({ deviceId })

    return Boolean(result.deletedCount)
  },
}
