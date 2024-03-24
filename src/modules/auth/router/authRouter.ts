import { Request, Response, Router } from 'express'
import { RequestBody } from '../../common/types'
import { AuthInputModel } from '../model/types/AuthInputModel'
import { authService } from '../model/services/authService'
import { HttpStatusCode } from '../../common/enums'
import { authCodeValidation, authPostValidation, resentEmailValidation } from '../validations/authValidations'
import { authQueryRepository } from '../model/repositories/authQueryRepository'
import { jwtAuthMiddleware } from '../../../app/config/middleware'
import { UserInputModel, userInputValidation } from '../../users'
import { ResultToRouterStatus } from '../../common/enums/ResultToRouterStatus'

export const authRouter = Router()

authRouter.post('/login', authPostValidation(), async (req: RequestBody<AuthInputModel>, res: Response) => {
  const tokens = await authService.createTokenPair(req.body.loginOrEmail, req.body.password)

  if (!tokens) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true,secure: true })
  return res.status(HttpStatusCode.OK_200).send({ accessToken: tokens.accessToken })
})

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    return
  }

  const updateTokensResult = await authService.updateTokenPair(refreshToken)

  if (updateTokensResult.status === ResultToRouterStatus.NOT_AUTHORIZED) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    return
  }

  res.cookie('refreshToken', updateTokensResult.data?.refreshToken, { httpOnly: true,secure: true })
  return res.status(HttpStatusCode.OK_200).send({ accessToken: updateTokensResult.data?.accessToken })
})

authRouter.post('/logout', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    return
  }

  const logoutResult = await authService.logoutUser(refreshToken)

  if (logoutResult.status === ResultToRouterStatus.NOT_AUTHORIZED) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
    return
  }

  return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
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

authRouter.post('/registration', userInputValidation(), async (req: RequestBody<UserInputModel>, res: Response) => {
  await authService.registerUser(req.body)

  return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

authRouter.post('/registration-confirmation', authCodeValidation(), async (req: RequestBody<{ code: string }>, res: Response) => {
  const confirmationResult = await authService.confirmUser(req.body.code)

  if (confirmationResult.status === ResultToRouterStatus.BAD_REQUEST) {
    return res.status(HttpStatusCode.BAD_REQUEST_400).send(confirmationResult.data)
  }

  return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

authRouter.post('/registration-email-resending', resentEmailValidation(), async (req: RequestBody<{ email: string }>, res: Response) => {
  const resendResult = await authService.resendConfirmationCode(req.body.email)

  if (resendResult.status === ResultToRouterStatus.BAD_REQUEST) {
    return res.status(HttpStatusCode.BAD_REQUEST_400).send(resendResult.data)
  }

  return res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
