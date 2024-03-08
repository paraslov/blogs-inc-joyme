import { Router, Response } from 'express'
import { jwtAuthMiddleware } from '../../../app/config/middleware'
import { usersQueryRepository } from '../../users'
import { HttpStatusCode } from '../../common/enums'
import { commentsQueryRepositories } from '../model/repositories/commentsQueryRepositories'
import { RequestParams, RequestParamsBody } from '../../common/types'
import { ResultToRouterStatus } from '../../common/enums/ResultToRouterStatus'
import { CommentInputModel } from '../model/types/CommentInputModel'
import { commentInputValidation } from '../validations/commentsValidations'

export const commentsRouter = Router()

commentsRouter.get('/commentId', jwtAuthMiddleware, async (req: RequestParams<{ commentId: string }>, res) => {
  const user = await usersQueryRepository.getUserById(req.userId)
  if(!user) {
    return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
  }

  const result = await commentsQueryRepositories.getCommentById(req.params.commentId)
  if (result.status === ResultToRouterStatus.NOT_FOUND) {
    return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
  }

  return res.status(HttpStatusCode.OK_200).send(result.data)
})
