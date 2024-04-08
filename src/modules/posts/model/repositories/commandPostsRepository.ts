import { PostInputModel } from '../types/PostInputModel'
import { commentsCollection, PostsMongooseModel } from '../../../../app/config/db'
import { PostDbModel } from '../types/PostDbModel'
import { CommentDbModel } from '../../../comments'

export const commandPostsRepository = {
  async createPost(createdPostData: PostDbModel) {
    const result = await PostsMongooseModel.create(createdPostData)

    return result._id.toString()
  },
  async createCommentToPost(newComment: CommentDbModel) {
    const result = await commentsCollection.insertOne(newComment)

    return result.insertedId.toString()
  },
  async updatePost(updatePostData: PostInputModel, postId: string) {
    const updateResult = await PostsMongooseModel.updateOne({ _id: postId }, updatePostData)

    return Boolean(updateResult.matchedCount)
  },
  async deletePostById(postId: string) {
    const deleteResult = await PostsMongooseModel.deleteOne({ _id: postId })

    return Boolean(deleteResult.deletedCount)
  }
}
