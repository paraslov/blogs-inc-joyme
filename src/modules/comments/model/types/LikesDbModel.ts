import { LikeStatuses } from '../enums/LikeStatuses'

export type LikesDbModel = {
  userId: string
  status: LikeStatuses
  parentId: string
  createdAt: Date
}
