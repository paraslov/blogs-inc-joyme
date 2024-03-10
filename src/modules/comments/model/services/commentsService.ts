import { CommentInputModel } from '../types/CommentInputModel'
import { commentsQueryRepository } from '../repositories/commentsQueryRepository'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import { commentsCommandRepository } from '../repositories/commentsCommandRepository'
import { CommentDbModel } from '../types/CommentDbModel'

export const commentsService = {
  async updateComment(commentId: string, userId: string, payload: CommentInputModel) {
    const commentResult = await this.getCommentResult(commentId, userId)

    if (commentResult.status !== ResultToRouterStatus.SUCCESS) {
      return commentResult
    }

    const updatedComment: CommentDbModel = {
      postId: commentResult.data!.postId,
      content: payload.content,
      commentatorInfo: commentResult.data!.commentatorInfo,
      createdAt: commentResult.data!.createdAt,
    }

    const updateResult = await commentsCommandRepository.updateComment(commentId, updatedComment)
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
    const commentResult = await this.getCommentResult(commentId, userId)

    if (commentResult.status !== ResultToRouterStatus.SUCCESS) {
      return commentResult
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
  async getCommentResult(commentId: string, userId: string) {
    const commentResult = await commentsQueryRepository.getCommentDbModelById(commentId)

    if (commentResult.status === ResultToRouterStatus.NOT_FOUND) {
      return {
        status: ResultToRouterStatus.NOT_FOUND,
        data: null,
      }
    } else if (commentResult.data?.commentatorInfo.userId !== userId) {
      return {
        status: ResultToRouterStatus.FORBIDDEN,
        data: null,
      }
    }

    return commentResult
  },
}
