import { commandPostsRepository } from '../repositories/commandPostsRepository'
import { PostInputModel } from '../types/PostInputModel'
import { queryBlogsRepository } from '../../../blogs'
import { ObjectId } from 'mongodb'
import { PostDbModel } from '../types/PostDbModel'

export const postsService = {
  async createPost(payload: PostInputModel) {
    const blogData = await queryBlogsRepository.getBlogById(new ObjectId(payload.blogId))

    if (!blogData) return false

    const createdPostData: PostDbModel = {
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
      blogName: blogData.name,
      createdAt: new Date().toISOString(),
    }

    return commandPostsRepository.createPost(createdPostData)
  },
  async updatePost(payload: PostInputModel, postId: ObjectId) {
    const updatePostData: PostInputModel = {
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
    }

    const foundBlog = await queryBlogsRepository.getBlogById(new ObjectId(payload.blogId))

    if (!foundBlog) return false

    return commandPostsRepository.updatePost(updatePostData, postId)
  },
  async deletePostById(postId: ObjectId) {
    return commandPostsRepository.deletePostById(postId)
  }
}
