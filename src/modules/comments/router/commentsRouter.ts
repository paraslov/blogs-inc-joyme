import { Response, Router } from 'express'
import { jwtAuthMiddleware } from '../../../app/config/middleware'
import { usersQueryRepository } from '../../users'
import { HttpStatusCode } from '../../common/enums'
import { commentsQueryRepository } from '../model/repositories/commentsQueryRepository'
import { RequestParams, RequestParamsBody } from '../../common/types'
import { ResultToRouterStatus } from '../../common/enums/ResultToRouterStatus'
import { CommentInputModel } from '../model/types/CommentInputModel'
import { commentInputValidation } from '../validations/commentsValidations'
import { commentsService } from '../model/services/commentsService'

export const commentsRouter = Router()

commentsRouter.get('/:commentId', async (req: RequestParams<{ commentId: string }>, res) => {
  const result = await commentsQueryRepository.getCommentById(req.params.commentId)
  if (result.status === ResultToRouterStatus.NOT_FOUND) {
    return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
  }

  return res.status(HttpStatusCode.OK_200).send(result.data)
})

commentsRouter.put(
  '/:commentId',
  jwtAuthMiddleware,
  commentInputValidation(),
  async (req: RequestParamsBody<{ commentId: string }, CommentInputModel>, res: Response) => {
    const user = await usersQueryRepository.getUserById(req.userId)
    if(!user || !req.params.commentId) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    const result = await commentsService.updateComment(req.params.commentId, user.id, { content: req.body.content })

    if (result.status === ResultToRouterStatus.NOT_FOUND) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    } else if (result.status === ResultToRouterStatus.FORBIDDEN) {
      return res.sendStatus(HttpStatusCode.FORBIDDEN_403)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  })

commentsRouter.delete(
  '/:commentId',
  jwtAuthMiddleware,
  async (req: RequestParamsBody<{ commentId: string }, CommentInputModel>, res: Response) => {
    const user = await usersQueryRepository.getUserById(req.userId)
    if(!user || !req.params.commentId) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    const result = await commentsService.deleteComment(req.params.commentId, user.id)

    if (result.status === ResultToRouterStatus.NOT_FOUND) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    } else if (result.status === ResultToRouterStatus.FORBIDDEN) {
      return res.sendStatus(HttpStatusCode.FORBIDDEN_403)
    }

    return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  })
