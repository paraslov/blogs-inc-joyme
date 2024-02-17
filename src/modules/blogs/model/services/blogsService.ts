import { BlogInputModel } from '../types/BlogInputModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { blogsCommandRepository } from '../repositories/blogsCommandRepository'
import { ObjectId } from 'mongodb'

export const blogsService = {
  async createBlog(payload: BlogInputModel): Promise<string> {
    const newBlog: Omit<BlogViewModel, 'id'> = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    }

    return blogsCommandRepository.createNewBlog(newBlog)
  },
  async updateBlog(blogId: string, payload: BlogInputModel) {
    const updateData: BlogInputModel = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
    }

    return blogsCommandRepository.updateBlog(new ObjectId(blogId), updateData)
  },
  async deleteBlog(blogId: string) {
    return blogsCommandRepository.deleteBlog(new ObjectId(blogId))
  }
}
