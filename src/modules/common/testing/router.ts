import { Router } from 'express'
import { HttpStatusCode } from '../enums'
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  sessionsCollection,
  usersCollection
} from '../../../app/config/db'

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  await blogsCollection.deleteMany({})
  await postsCollection.deleteMany({})
  await usersCollection.deleteMany({})
  await sessionsCollection.deleteMany({})
  await commentsCollection.deleteMany({})

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
