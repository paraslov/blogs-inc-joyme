import { db } from '../../../app/app'

export const blogsRepository = {
  async getAllBlogs() {
    return db.blogs
  }
}
