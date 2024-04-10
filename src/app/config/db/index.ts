import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'
import {
  BlogsMongooseModel,
  PostsMongooseModel,
  CommentsMongooseModel,
  UsersMongooseModel,
  runDbMongoose
} from './mongoose/mongoose'
import { AppSettings } from '../../appSettings'
import { Collections } from './config'
import { AuthSessionsDbModel, RateLimitModel } from '../../../modules/auth'
import 'dotenv/config'

export let client: MongoClient
let authSessionsCollection: Collection<AuthSessionsDbModel>
let rateLimitCollection: Collection<RateLimitModel>

async function runDb() {
  const uri = AppSettings.MONGO_URI
  const dbName = AppSettings.DB_NAME

  if (!uri || !dbName) {
    console.log('@> uri: ', uri)
    console.log('@> dbName: ', dbName)
    throw new Error('!!! MONGODB_URI or DB_NAME not found')
  }

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const db = client.db(dbName)
  authSessionsCollection = db.collection<AuthSessionsDbModel>(Collections.SESSIONS)
  rateLimitCollection = db.collection<RateLimitModel>(Collections.RATE_LIMIT)

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log("Pinged your deployment. You successfully connected to MongoDB!")
  } catch (err) {
    console.dir('!!! Can\'t connect to database!', err)
    await client.close();
    console.log('DB work is finished successfully')
  }
}

const cleanup = async () => {
  await client.close()
  await mongoose.disconnect()
  process.exit()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

export {
  runDb,
  runDbMongoose,
  authSessionsCollection,
  rateLimitCollection,
  BlogsMongooseModel,
  PostsMongooseModel,
  CommentsMongooseModel,
  UsersMongooseModel,
}
