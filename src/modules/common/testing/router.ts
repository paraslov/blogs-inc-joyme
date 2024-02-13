import { Router } from 'express'
import { db } from '../../../app/app'
import { HttpStatusCode } from '../enums'
import { blogsCollection, postsCollection } from '../../../app/config/db'

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  await blogsCollection.deleteMany({})
  await postsCollection.deleteMany({})

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
