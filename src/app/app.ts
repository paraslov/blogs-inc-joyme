import express from 'express'
import { createDB } from './config/db'
import { initRoutes } from './config/routes'

export const app = express()
export const db = createDB()

const parseBodyMiddleware = express.json()
app.use(parseBodyMiddleware)

initRoutes()
