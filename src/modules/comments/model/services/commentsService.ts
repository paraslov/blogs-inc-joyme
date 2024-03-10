import { CommentInputModel } from '../types/CommentInputModel'
import { commentsQueryRepository } from '../repositories/commentsQueryRepository'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import { commentsCommandRepository } from '../repositories/commentsCommandRepository'

export const commentsService = {
  async updateComment(commentId: string, userId: string, payload: CommentInputModel) {
    const commentAvailability = await this.isCommentAvailable(commentId, userId)

    if (commentAvailability.status !== ResultToRouterStatus.SUCCESS) {
      return commentAvailability
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
  },
  async deleteComment(commentId: string, userId: string) {
    const commentAvailability = await this.isCommentAvailable(commentId, userId)

    if (commentAvailability.status !== ResultToRouterStatus.SUCCESS) {
      return commentAvailability
    }

    const deleteResult = await commentsCommandRepository.deleteComment(commentId)
    if (!deleteResult) {
      return {
        status: ResultToRouterStatus.NOT_FOUND
      }
    }

    return {
      status: ResultToRouterStatus.SUCCESS
    }
  },
  async isCommentAvailable(commentId: string, userId: string) {
    const commentResult = await commentsQueryRepository.getCommentById(commentId)

    if (commentResult.status === ResultToRouterStatus.NOT_FOUND) {
      return {
        status: ResultToRouterStatus.NOT_FOUND
      }
    } else if (commentResult.data?.commentatorInfo.userId !== userId) {
      return {
        status: ResultToRouterStatus.FORBIDDEN
      }
    }

    return {
      status: ResultToRouterStatus.SUCCESS
    }
  }
}
