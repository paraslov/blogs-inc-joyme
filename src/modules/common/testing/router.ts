import { Router } from 'express'
import { HttpStatusCode } from '../enums'
import {
  authSessionsCollection,
  usersCollection,
  rateLimitCollection,
  BlogsMongooseModel,
  PostsMongooseModel,
  CommentsMongooseModel,
} from '../../../app/config/db'

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  await BlogsMongooseModel.deleteMany({})
  await PostsMongooseModel.deleteMany({})
  await usersCollection.deleteMany({})
  await authSessionsCollection.deleteMany({})
  await CommentsMongooseModel.deleteMany({})
  await rateLimitCollection.deleteMany({})

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
