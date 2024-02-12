import express from 'express'
import { initRoutes } from './config/routes'

export const app = express()
export const db = {} as any

const parseBodyMiddleware = express.json()
app.use(parseBodyMiddleware)

initRoutes()
