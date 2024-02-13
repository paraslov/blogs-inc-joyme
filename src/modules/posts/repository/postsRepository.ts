import { blogsRepository } from '../../blogs'
import { PostInputModel } from '../model/PostInputModel'
import { PostViewModel } from '../model/PostViewModel'
import { postsCollection } from '../../../app/config/db'

export const postsRepository = {
  async getAllPosts() {
    return postsCollection.find({}).toArray()
  },
  async getPostById(postId: string) {
    return postsCollection.findOne({ id: postId })
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
      blogName: blogData.name,
      createdAt: new Date().toISOString(),
    }

    await postsCollection.insertOne(createdPost)

    return createdPost
  },
  async updatePost(payload: PostInputModel, postId: string) {
    const foundBlog = await blogsRepository.getBlogById(payload.blogId)

    if (!foundBlog) return false

    const updateResult = await postsCollection.updateOne({ id: postId }, { $set: {
        title: payload.title,
        shortDescription: payload.shortDescription,
        content: payload.content,
        blogId: payload.blogId,
      }})

    return Boolean(updateResult.matchedCount)
  },
  async deletePostById(postId: string) {
    const deleteResult = await postsCollection.deleteOne({ id: postId })

    return Boolean(deleteResult.deletedCount)
  }
}
