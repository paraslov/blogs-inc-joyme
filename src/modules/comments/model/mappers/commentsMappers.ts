import { CommentDbModel } from '../types/CommentDbModel'
import { CommentViewModel } from '../types/CommentViewModel'
import { WithId } from 'mongodb'

export const commentsMappers = {
  mapCommentDtoToViewModel(commentFromDb: WithId<CommentDbModel>): CommentViewModel {
    return {
      id: commentFromDb._id.toString(),
      content: commentFromDb.content,
      commentatorInfo: commentFromDb.commentatorInfo,
      createdAt: commentFromDb.createdAt,
    }
  }
}
