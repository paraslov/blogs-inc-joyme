import express from 'express'
import { createDB } from './modules/common/db'
import { RoutesList } from './modules/common/routes'

export const app = express()
export const db = createDB()

const parseBodyMiddleware = express.json()
app.use(parseBodyMiddleware)

app.get(RoutesList.BASE, (req, res) => {
  res.send('Welcome to JoymeStudios Blogs App!')
})

app.get(RoutesList.VERSION, (req, res) => {
  res.send('blogs-inc-joyme: v1.0.0')
})
