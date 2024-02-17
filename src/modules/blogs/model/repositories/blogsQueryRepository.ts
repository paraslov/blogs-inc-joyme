import { blogsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { blogsMappers } from '../mappers/blogsMappers'

export const blogsQueryRepository = {
  async getAllBlogs() {
    const foundBlogs = await blogsCollection.find({}).toArray()
    return foundBlogs.map(blogsMappers.mapCreatedBlogToView)
  },
  async getBlogById(blogId: ObjectId) {
    const foundBlog = await blogsCollection.findOne({ _id: blogId })
    const viewModelBlog = foundBlog && blogsMappers.mapCreatedBlogToView(foundBlog)

    return viewModelBlog
  },
}
