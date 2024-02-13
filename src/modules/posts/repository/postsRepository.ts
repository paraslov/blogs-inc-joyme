import { db } from '../../../app/app'
import { blogsRepository } from '../../blogs'
import { PostInputModel } from '../model/PostInputModel'
import { PostViewModel } from '../model/PostViewModel'

export const postsRepository = {
  async getAllPosts() {
    return db.posts
  },
  async getPostById(postId: string) {
    return db.posts.find((post) => post.id === postId)
  },
  async createPost(payload: PostInputModel) {
    const blogData = await blogsRepository.getBlogById(payload.blogId)

    if (!blogData) return false

    const createdPost: PostViewModel = {
      id: String(Date.now()),
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
      blogName: blogData?.name,
      createdAt: new Date().toISOString(),
    }

    db.posts.push(createdPost)

    return createdPost
  },
  async updatePost(payload: PostInputModel, postId: string) {
    const blogData = await blogsRepository.getBlogById(payload.blogId)
    const updatingPost = await this.getPostById(postId)

    if (!updatingPost || !blogData) return false

    updatingPost.blogId = payload.blogId
    updatingPost.title = payload.title
    updatingPost.shortDescription = payload.shortDescription
    updatingPost.content = payload.content
    updatingPost.blogName = blogData.name

    return true
  },
  async deletePostById(postId: string) {
    const deletingPost = await this.getPostById(postId)

    if (!deletingPost) return false

    db.posts = db.posts.filter((post) => post.id !== postId)

    return true
  }
}
