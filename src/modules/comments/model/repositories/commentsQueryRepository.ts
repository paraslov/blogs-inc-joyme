import { CommentsMongooseModel, LikesMongooseModel } from '../../../../app/config/db'
import { commentsMappers } from '../mappers/commentsMappers'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'

export const commentsQueryRepository = {
  async getCommentById(commentId: string) {
    const comment = await CommentsMongooseModel.findOne({ _id: commentId })
    const likeStatus = await this.getLikeStatusByCommentId(commentId)

    if (!comment) {
      return {
        status: ResultToRouterStatus.NOT_FOUND,
      }
    }

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: commentsMappers.mapCommentDtoToViewModel(comment, likeStatus),
    }
  },
  async getLikeStatus(userId: string) {
    return LikesMongooseModel.findOne({ userId })
  },
  async getLikeStatusByCommentId(commentId: string) {
    return LikesMongooseModel.findOne({ parentId: commentId })
  },
  async getCommentDbModelById(commentId: string) {
    const comment = await CommentsMongooseModel.findOne({ _id: commentId })

    if (!comment) {
      return {
        status: ResultToRouterStatus.NOT_FOUND,
      }
    }

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: comment,
    }
  }
}
