import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'
import { AppSettings } from '../../appSettings'
import { Collections } from './config'
import { BlogDbModel } from '../../../modules/blogs'
import { PostDbModel } from '../../../modules/posts'
import { UserDbModel } from '../../../modules/users'
import { CommentDbModel } from '../../../modules/comments'

export let client: MongoClient
let blogsCollection: Collection<BlogDbModel>
let postsCollection: Collection<PostDbModel>
let usersCollection: Collection<UserDbModel>
let commentsCollection: Collection<CommentDbModel>

async function runDb() {
  const uri = AppSettings.MONGO_URI
  if (!uri) {
    throw new Error('!!! MONGODB_URI not found')
  }

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const db = client.db(process.env.MONGO_DB_NAME)
  blogsCollection = db.collection<BlogDbModel>(Collections.BLOGS)
  postsCollection = db.collection<PostDbModel>(Collections.POSTS)
  usersCollection = db.collection<UserDbModel>(Collections.USERS)
  commentsCollection = db.collection<CommentDbModel>(Collections.COMMENTS)

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
  process.exit()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

export {
  runDb,
  blogsCollection,
  postsCollection,
  usersCollection,
  commentsCollection,
}
