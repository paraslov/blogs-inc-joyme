import { MongoMemoryServer } from 'mongodb-memory-server'
import { AppSettings } from '../../../app/appSettings'
import { client, runDb, runDbMongoose } from '../../../app/config/db'
import mongoose from 'mongoose'

function getMongoMemoryService() {
  let memoryServer: MongoMemoryServer

  async function connect() {
    memoryServer = await MongoMemoryServer.create()
    AppSettings.MONGO_URI = memoryServer.getUri()
    AppSettings.DB_NAME = 'memoryServerDbName'

    await runDb()
    await runDbMongoose()
  }

  async function close() {
      await client.close()
      await mongoose.disconnect()
      await memoryServer.stop()
  }

  return { connect, close }
}

export const memoryService = getMongoMemoryService()
