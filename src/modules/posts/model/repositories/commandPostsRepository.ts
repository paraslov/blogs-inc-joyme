import { blogsQueryRepository } from '../../../blogs'
import { PostInputModel } from '../types/PostInputModel'
import { PostViewModel } from '../types/PostViewModel'
import { postsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { PostDbModel } from '../types/PostDbModel'

export const commandPostsRepository = {
  async createPost(createdPostData: PostDbModel) {
    const result = await postsCollection.insertOne(createdPostData)

    return result.insertedId.toString()
  },
  async updatePost(updatePostData: PostInputModel, postId: ObjectId) {
    const updateResult = await postsCollection.updateOne({ _id: postId }, { $set: updatePostData })

    return Boolean(updateResult.matchedCount)
  },
  async deletePostById(postId: ObjectId) {
    const deleteResult = await postsCollection.deleteOne({ _id: postId })

    return Boolean(deleteResult.deletedCount)
  }
}
