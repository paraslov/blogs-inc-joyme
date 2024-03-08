import { commentsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { CommentInputModel } from '../types/CommentInputModel'

export const commentsCommandRepository = {
  async updateComment(commentId: string, payload: CommentInputModel) {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      payload,
    )

    return Boolean(result.matchedCount)
  }
}
