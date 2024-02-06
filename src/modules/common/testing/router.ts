import { Router } from 'express'
import { db } from '../../../app/app'
import { HttpStatusCode } from '../enums'

export const testingRouter = Router()

testingRouter.delete('/all-data', (req, res) => {
  db.blogs = []
  db.posts = []

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
