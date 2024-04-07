import { BlogInputModel } from '../types/BlogInputModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { BlogMongooseModel, postsCollection } from '../../../../app/config/db'
import { PostDbModel } from '../../../posts'

export const commandBlogsRepository = {
  async createNewBlog(newBlog: Omit<BlogViewModel, 'id'>): Promise<string> {
    const result = await BlogMongooseModel.create(newBlog)

    return result._id.toString()
  },
  async createNewPostForBlog(newPostData: PostDbModel) {
    const result = await postsCollection.insertOne(newPostData)

    return result.insertedId.toString()
  },
  async updateBlog(blogId: string, updateData: BlogInputModel) {
    const updateResult = await BlogMongooseModel.updateOne({ _id: blogId }, updateData)

    return Boolean(updateResult.matchedCount)
  },
  async deleteBlog(blogId: string) {
    const deleteResult = await BlogMongooseModel.deleteOne({ _id: blogId })

    return Boolean(deleteResult.deletedCount)
  }
}
