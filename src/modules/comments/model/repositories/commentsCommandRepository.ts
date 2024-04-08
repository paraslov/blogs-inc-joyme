import { CommentsMongooseModel } from '../../../../app/config/db'
import { CommentDbModel } from '../types/CommentDbModel'

export const commentsCommandRepository = {
  async updateComment(commentId: string, updatedComment: CommentDbModel) {
    const result = await CommentsMongooseModel.updateOne(
      { _id: commentId },
      updatedComment,
    )

    return Boolean(result.matchedCount)
  },
  async deleteComment(commentId: string) {
    const result = await CommentsMongooseModel.deleteOne({ _id: commentId })

    return Boolean(result.deletedCount)
  }
}
