import { commentsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { CommentInputModel } from '../types/CommentInputModel'
import { CommentDbModel } from '../types/CommentDbModel'

export const commentsCommandRepository = {
  async updateComment(commentId: string, updatedComment: CommentDbModel) {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: updatedComment },
    )

    return Boolean(result.matchedCount)
  },
  async deleteComment(commentId: string) {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(commentId) })

    return Boolean(result.deletedCount)
  }
}
