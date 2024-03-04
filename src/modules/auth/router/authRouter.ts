import { Router, Response } from 'express'
import { RequestBody } from '../../common/types'
import { AuthInputModel } from '../model/types/AuthInputModel'
import { authService } from '../model/services/authService'
import { HttpStatusCode } from '../../common/enums'
import { authPostValidation } from '../validations/authValidations'

export const authRouter = Router()

authRouter.post('/login', authPostValidation(), async (req: RequestBody<AuthInputModel>, res: Response) => {
  const token = await authService.checkUser(req.body.loginOrEmail, req.body.password)

  if (!token) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  return res.status(HttpStatusCode.OK_200).send({ accessToken: token })
})
