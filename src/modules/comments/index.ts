import { commentsRouter } from './router/commentsRouter'
import { commentsQueryRepository } from './model/repositories/commentsQueryRepository'
import { commentsMappers } from './model/mappers/commentsMappers'

import type { CommentDbModel } from './model/types/CommentDbModel'
import { LikesDbModel } from './model/types/LikesDbModel'

export {
  commentsRouter,
  commentsQueryRepository,
  commentsMappers,
}

export type {
  CommentDbModel,
  LikesDbModel,
}
