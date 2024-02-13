import express from 'express'
import { initRoutes } from './config/routes'

export const app = express()

const parseBodyMiddleware = express.json()
app.use(parseBodyMiddleware)

initRoutes()
