import { Request, Response, Router } from 'express'
import { RequestBody } from '../../common/types'
import { AuthInputModel } from '../model/types/AuthInputModel'
import { authService } from '../model/services/authService'
import { HttpStatusCode } from '../../common/enums'
import { authPostValidation } from '../validations/authValidations'
import { authQueryRepository } from '../model/repositories/authQueryRepository'
import { jwtAuthMiddleware } from '../../../app/config/middleware'

export const authRouter = Router()

authRouter.post('/login', authPostValidation(), async (req: RequestBody<AuthInputModel>, res: Response) => {
  const token = await authService.checkUser(req.body.loginOrEmail, req.body.password)

  if (!token) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  return res.status(HttpStatusCode.OK_200).send({ accessToken: token })
})

authRouter.get('/me', jwtAuthMiddleware , async (req: Request, res) => {
  const userId = req.userId

  if (!userId) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  const user = await authQueryRepository.getUserMeModelById(userId)

  if (!user) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  return res.status(HttpStatusCode.OK_200).send(user)
})
