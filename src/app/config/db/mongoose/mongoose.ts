import { AppSettings } from '../../../appSettings'
import mongoose from 'mongoose'
import { BlogDbModel } from '../../../../modules/blogs'
import { WithId } from 'mongodb'
import { Collections } from '../config'
import { MongooseSchemas } from './schemas/schemas'
import { PostDbModel } from '../../../../modules/posts'
import { CommentDbModel } from '../../../../modules/comments'

export const BlogsMongooseModel = mongoose.model<WithId<BlogDbModel>>(Collections.BLOGS, MongooseSchemas.BlogsSchema)
export const PostsMongooseModel = mongoose.model<WithId<PostDbModel>>(Collections.POSTS, MongooseSchemas.PostsSchema)
export const CommentsMongooseModel = mongoose.model<WithId<CommentDbModel>>(Collections.POSTS, MongooseSchemas.CommentsSchema)

export async function runDbMongoose() {
  const uri = AppSettings.MONGO_URI
  const dbName = AppSettings.DB_NAME
  if (!uri || !dbName) {
    console.log('@> uri: ', uri)
    console.log('@> dbName: ', dbName)
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
