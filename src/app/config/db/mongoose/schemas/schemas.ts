import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { BlogDbModel } from '../../../../../modules/blogs'

export const MongooseSchemas = {
  BlogsSchema: new mongoose.Schema<WithId<BlogDbModel>>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date },
    isMembership: { type: Boolean }
  }),
}
