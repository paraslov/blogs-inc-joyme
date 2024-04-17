import { PostInputModel } from '../types/PostInputModel'
import { CommentsMongooseModel, PostsMongooseModel } from '../../../../app/config/db'
import { PostDbModel } from '../types/PostDbModel'
import { CommentDbModel } from '../../../comments'

export class CommandPostsRepository {
  async createPost(createdPostData: PostDbModel) {
    const result = await PostsMongooseModel.create(createdPostData)

    return result._id.toString()
  }
  async createCommentToPost(newComment: CommentDbModel) {
    const result = await CommentsMongooseModel.create(newComment)

    return result._id.toString()
  }
  async updatePost(updatePostData: PostInputModel, postId: string) {
    const updateResult = await PostsMongooseModel.updateOne({ _id: postId }, updatePostData)

    return Boolean(updateResult.matchedCount)
  }
  async deletePostById(postId: string) {
    const deleteResult = await PostsMongooseModel.deleteOne({ _id: postId })

    return Boolean(deleteResult.deletedCount)
  }
}
