import { db } from '../../../app/app'
import { blogsRepository } from '../../blogs'
import { PostInputModel } from '../model/PostInputModel'
import { PostViewModel } from '../model/PostViewModel'

export const postsRepository = {
  async getAllPosts() {
    return db.posts
  },
  async createPost(payload: PostInputModel) {
    const blogData = await blogsRepository.getBlogById(payload.blogId)

    if (!blogData) return false

    const createdPost: PostViewModel = {
      id: String(new Date()),
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
      blogName: blogData?.name,
    }

    db.posts.push(createdPost)

    return createdPost
  }
}
