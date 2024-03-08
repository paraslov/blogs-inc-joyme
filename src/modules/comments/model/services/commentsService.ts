import { CommentInputModel } from '../types/CommentInputModel'
import { commentsQueryRepositories } from '../repositories/commentsQueryRepositories'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import { commentsCommandRepository } from '../repositories/commentsCommandRepository'

export const commentsService = {
  async updateComment(commentId: string, userId: string, payload: CommentInputModel) {
    const commentResult = await commentsQueryRepositories.getCommentById(commentId)

    if (commentResult.status === ResultToRouterStatus.NOT_FOUND) {
      return {
        status: ResultToRouterStatus.NOT_FOUND
      }
    } else if (commentResult.data?.commentatorInfo.userId !== userId) {
      return {
        status: ResultToRouterStatus.FORBIDDEN
      }
    }

    const updateResult = await commentsCommandRepository.updateComment(commentId, payload)

    if (!updateResult) {
      return {
        status: ResultToRouterStatus.NOT_FOUND
      }
    }

    return {
      status: ResultToRouterStatus.SUCCESS
    }
  }
}
