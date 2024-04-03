import { Router } from 'express'
import { jwtAuthMiddleware } from '../../../app/config/middleware'
import { devicesQueryRepository } from '../model/repositories/devicesQueryRepository'
import { HttpStatusCode } from '../../common/enums'
import { devicesService } from '../model/services/devicesService'

export const devicesRouter = Router()

devicesRouter.get('/', jwtAuthMiddleware, async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  const hasAuthSession = await devicesService.checkAuthSessionByRefreshToken(req.userId, refreshToken)
  if (!hasAuthSession) {
    return res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)
  }

  const userDevices = await devicesQueryRepository.getDevices(req.userId)
  return res.status(HttpStatusCode.OK_200).send(userDevices)
})
