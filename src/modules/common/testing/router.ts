import { Router } from 'express'
import { HttpStatusCode } from '../enums'
import {
  commentsCollection,
  postsCollection,
  authSessionsCollection,
  usersCollection,
  rateLimitCollection,
  BlogMongooseModel,
} from '../../../app/config/db'

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  await BlogMongooseModel.deleteMany({})
  await postsCollection.deleteMany({})
  await usersCollection.deleteMany({})
  await authSessionsCollection.deleteMany({})
  await commentsCollection.deleteMany({})
  await rateLimitCollection.deleteMany({})

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
