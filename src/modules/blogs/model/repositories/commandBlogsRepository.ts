import { BlogInputModel } from '../types/BlogInputModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { blogsCollection, postsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { PostDbModel } from '../../../posts'

export const commandBlogsRepository = {
  async createNewBlog(newBlog: Omit<BlogViewModel, 'id'>): Promise<string> {
    const result = await blogsCollection.insertOne(newBlog)

    return result.insertedId.toString()
  },
  async createNewPostForBlog(newPostData: PostDbModel) {
    const result = await postsCollection.insertOne(newPostData)

    return result.insertedId.toString()
  },
  async updateBlog(blogId: string, updateData: BlogInputModel) {
    const updateResult = await blogsCollection.updateOne({ _id: new ObjectId(blogId) }, { $set: updateData })

    return Boolean(updateResult.matchedCount)
  },
  async deleteBlog(blogId: string) {
    const deleteResult = await blogsCollection.deleteOne({ _id: new ObjectId(blogId) })

    return Boolean(deleteResult.deletedCount)
  }
}
