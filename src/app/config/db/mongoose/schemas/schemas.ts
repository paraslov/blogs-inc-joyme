import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { BlogDbModel } from '../../../../../modules/blogs'
import { PostDbModel } from '../../../../../modules/posts'
import { CommentDbModel } from '../../../../../modules/comments'
import { CommentatorInfoModel } from '../../../../../modules/comments/model/types/CommentatorInfoModel'

const CommentatorSchema = new mongoose.Schema<WithId<CommentatorInfoModel>>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
})

export const MongooseSchemas = {
  BlogsSchema: new mongoose.Schema<WithId<BlogDbModel>>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: Date },
    isMembership: { type: Boolean },
  }),
  PostsSchema: new mongoose.Schema<WithId<PostDbModel>>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogName: { type: String, required: true },
    blogId: { type: String, required: true },
    createdAt: { type: Date },
  }),
  CommentsSchema: new mongoose.Schema<WithId<CommentDbModel>>({
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: CommentatorSchema,
    createdAt: { type: String, required: true },
  }),
}
