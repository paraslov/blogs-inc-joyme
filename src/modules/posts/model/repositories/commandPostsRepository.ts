import { PostInputModel } from '../types/PostInputModel'
import { postsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { PostDbModel } from '../types/PostDbModel'

export const commandPostsRepository = {
  async createPost(createdPostData: PostDbModel) {
    const result = await postsCollection.insertOne(createdPostData)

    return result.insertedId.toString()
  },
  async updatePost(updatePostData: PostInputModel, postId: string) {
    const updateResult = await postsCollection.updateOne({ _id: new ObjectId(postId) }, { $set: updatePostData })

    return Boolean(updateResult.matchedCount)
  },
  async deletePostById(postId: string) {
    const deleteResult = await postsCollection.deleteOne({ _id: new ObjectId(postId) })

    return Boolean(deleteResult.deletedCount)
  }
}
