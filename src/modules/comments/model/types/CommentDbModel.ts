import { CommentatorInfoModel } from './CommentatorInfoModel'

export type CommentDbModel = {
  content: string
  commentatorInfo: CommentatorInfoModel
  createdAt: string
}
