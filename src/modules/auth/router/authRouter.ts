import { Router, Response } from 'express'
import { RequestBody } from '../../common/types'
import { AuthInputModel } from '../model/types/AuthInputModel'
import { authService } from '../model/services/authService'
import { HttpStatusCode } from '../../common/enums'
import { authPostValidation } from '../validations/authValidations'

export const authRouter = Router()

authRouter.post('/login', authPostValidation(), async (req: RequestBody<AuthInputModel>, res: Response) => {
  const isAuthPassed = await authService.checkUser(req.body.loginOrEmail, req.body.password)

  if (!isAuthPassed) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
