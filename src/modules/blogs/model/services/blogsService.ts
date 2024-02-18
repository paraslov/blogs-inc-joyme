import { BlogInputModel } from '../types/BlogInputModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { commandBlogsRepository } from '../repositories/commandBlogsRepository'
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

    return commandBlogsRepository.createNewBlog(newBlog)
  },
  async updateBlog(blogId: string, payload: BlogInputModel) {
    const updateData: BlogInputModel = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
    }

    return commandBlogsRepository.updateBlog(new ObjectId(blogId), updateData)
  },
  async deleteBlog(blogId: string) {
    return commandBlogsRepository.deleteBlog(new ObjectId(blogId))
  }
}
