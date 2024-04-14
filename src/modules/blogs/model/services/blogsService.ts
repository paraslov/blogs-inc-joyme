import { BlogInputModel } from '../types/BlogInputModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { commandBlogsRepository } from '../repositories/commandBlogsRepository'
import { PostDbModel, PostInputModel } from '../../../posts'
import { queryBlogsRepository } from '../repositories/QueryBlogsRepository'

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
  async createPostForBlog(payload: PostInputModel) {
    const blogToAddPostIn = await queryBlogsRepository.getBlogById(payload.blogId)
    const newPostData: PostDbModel = {
      blogId: payload.blogId,
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogName: blogToAddPostIn?.name ?? '',
      createdAt: new Date().toISOString(),
    }

    if (!blogToAddPostIn) return null

    return await commandBlogsRepository.createNewPostForBlog(newPostData)
  },
  async updateBlog(blogId: string, payload: BlogInputModel) {
    const updateData: BlogInputModel = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
    }

    return commandBlogsRepository.updateBlog(blogId, updateData)
  },
  async deleteBlog(blogId: string) {
    return commandBlogsRepository.deleteBlog(blogId)
  }
}
