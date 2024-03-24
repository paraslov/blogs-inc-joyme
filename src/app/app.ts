import express from 'express'
import { initAppRoutes } from './config/routes'
import { initAppMiddleware } from './config/middleware/initAppMiddleware'

export const app = express()

initAppMiddleware()
initAppRoutes()
