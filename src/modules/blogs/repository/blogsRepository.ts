import { db } from '../../../app/app'
import { BlogInputModel } from '../model/BlogInputModel'
import { BlogViewModel } from '../model/BlogViewModel'

export const blogsRepository = {
  async getAllBlogs() {
    return db.blogs
  },
  async getBlogById(blogId: string) {
    return db.blogs.find((blog) => blog.id === blogId)
  },
  async createNewBlog(payload: BlogInputModel): Promise<BlogViewModel> {
    const newBlog = {
      id: String(new Date()),
      ...payload,
    }

    db.blogs.push(newBlog)
    return newBlog
  },
  async updateBlog(blogId: string, payload: BlogInputModel) {
    const foundBlog = await this.getBlogById(blogId)

    if (!foundBlog) return false

    db.blogs = db.blogs.map((blog) => blog.id === blogId ? {...blog, ...payload} : blog)

    return true
  },
  async deleteBlog(blogId: string) {
    const foundBlog = await this.getBlogById(blogId)

    if (!foundBlog) return false

    db.blogs = db.blogs.filter((blog) => blog.id !== blogId)

    return true
  }
}
