import { MongoClient, ServerApiVersion } from 'mongodb'
import 'dotenv/config'
import { BlogViewModel } from '../../../modules/blogs'
import { PostViewModel } from '../../../modules/posts'
import { Collections } from './config'


const uri = process.env.MONGO_URI
if (!uri) {
  throw new Error('!!! MONGODB_URI not found')
}

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db(process.env.MONGO_DB_NAME)
const blogsCollection = db.collection<BlogViewModel>(Collections.BLOGS)
const postsCollection = db.collection<PostViewModel>(Collections.POSTS)

async function runDb() {
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

const cleanup = async (event: any) => {
  await client.close()
  process.exit()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

export {
  runDb,
  blogsCollection,
  postsCollection,
}
