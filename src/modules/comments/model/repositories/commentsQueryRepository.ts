import { commentsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { commentsMappers } from '../mappers/commentsMappers'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'

export const commentsQueryRepository = {
  async getCommentById(commentId: string) {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) })

    if (!comment) {
      return {
        status: ResultToRouterStatus.NOT_FOUND,
      }
    }

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: commentsMappers.mapCommentDtoToViewModel(comment),
    }
  },
  async getCommentDbModelById(commentId: string) {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(commentId) })

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
