import { BlogInputModel } from '../types/BlogInputModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { blogsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'

export const blogsCommandRepository = {
  async createNewBlog(newBlog: Omit<BlogViewModel, 'id'>): Promise<string> {
    const result = await blogsCollection.insertOne({ ...newBlog })

    return result.insertedId.toString()
  },
  async updateBlog(blogId: ObjectId, updateData: BlogInputModel) {
    const updateResult = await blogsCollection.updateOne({ _id: blogId }, { $set: updateData })

    return Boolean(updateResult.matchedCount)
  },
  async deleteBlog(blogId: ObjectId) {
    const deleteResult = await blogsCollection.deleteOne({ _id: blogId })

    return Boolean(deleteResult.deletedCount)
  }
}
