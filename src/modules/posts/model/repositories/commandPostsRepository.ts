import { PostInputModel } from '../types/PostInputModel'
import { commentsCollection, postsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { PostDbModel } from '../types/PostDbModel'
import { CommentDbModel } from '../../../comments'

export const commandPostsRepository = {
  async createPost(createdPostData: PostDbModel) {
    const result = await postsCollection.insertOne(createdPostData)

    return result.insertedId.toString()
  },
  async createCommentToPost(newComment: CommentDbModel) {
    const result = await commentsCollection.insertOne(newComment)

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
