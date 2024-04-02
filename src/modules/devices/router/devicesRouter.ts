import { Router } from 'express'
import { jwtAuthMiddleware } from '../../../app/config/middleware'
import { deviceQueryRepository } from '../model/repositories/deviceQueryRepository'
import { HttpStatusCode } from '../../common/enums'

export const devicesRouter = Router()

devicesRouter.get('/', jwtAuthMiddleware, async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    res.sendStatus(HttpStatusCode.UNAUTHORIZED_401)

    return
  }

  const userId = req.userId
  const userDevices = await deviceQueryRepository.getDevices(req.userId)

  return res.status(HttpStatusCode.OK_200).send(userDevices)
})
