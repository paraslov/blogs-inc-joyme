import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'
import 'dotenv/config'
import { AppSettings } from '../../appSettings'
import { Collections } from './config'
import { BlogDbModel } from '../../../modules/blogs'
import { PostDbModel } from '../../../modules/posts'
import { UserDbModel } from '../../../modules/users'
import { CommentDbModel } from '../../../modules/comments'
import { AuthSessionsDbModel, RateLimitModel } from '../../../modules/auth'

export let client: MongoClient
let blogsCollection: Collection<BlogDbModel>
let postsCollection: Collection<PostDbModel>
let usersCollection: Collection<UserDbModel>
let commentsCollection: Collection<CommentDbModel>
let authSessionsCollection: Collection<AuthSessionsDbModel>
let rateLimitCollection: Collection<RateLimitModel>

async function runDb() {
  const uri = AppSettings.MONGO_URI
  const dbName = AppSettings.DB_NAME
  if (!uri || !dbName) {
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
  blogsCollection = db.collection<BlogDbModel>(Collections.BLOGS)
  postsCollection = db.collection<PostDbModel>(Collections.POSTS)
  usersCollection = db.collection<UserDbModel>(Collections.USERS)
  commentsCollection = db.collection<CommentDbModel>(Collections.COMMENTS)
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

async function runDbMongoose() {
  const uri = AppSettings.MONGO_URI
  const dbName = AppSettings.DB_NAME
  if (!uri || !dbName) {
    throw new Error('!!! MONGODB_URI or DB_NAME not found')
  }

  try {
    await mongoose.connect(uri, { dbName })
    console.log("Pinged your deployment. You successfully connected to mongoose!")
  } catch (err) {
    console.dir('!!! Can\'t connect to mongoose!', err)
    await mongoose.disconnect()
    console.log('Mongoose work is finished successfully')
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
  blogsCollection,
  postsCollection,
  usersCollection,
  commentsCollection,
  authSessionsCollection,
  rateLimitCollection,
}
