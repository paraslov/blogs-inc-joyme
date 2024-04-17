import { LikeStatuses } from '../../../likes'

export type CommentLikesInfoModel = {
  likesCount: number
  dislikesCount: number
  myStatus: LikeStatuses
}
