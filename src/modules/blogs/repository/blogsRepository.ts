import { db } from '../../../app'

export const blogsRepository = {
  async getAllBlogs() {
    return db.blogs
  }
}
