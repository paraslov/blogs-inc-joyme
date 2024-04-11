import { Router } from 'express'
import { HttpStatusCode } from '../enums'
import {
  AuthSessionsMongooseModel,
  BlogsMongooseModel,
  CommentsMongooseModel,
  PostsMongooseModel,
  RateLimitMongooseModel,
  UsersMongooseModel,
} from '../../../app/config/db'

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  await BlogsMongooseModel.deleteMany({})
  await PostsMongooseModel.deleteMany({})
  await UsersMongooseModel.deleteMany({})
  await AuthSessionsMongooseModel.deleteMany({})
  await CommentsMongooseModel.deleteMany({})
  await RateLimitMongooseModel.deleteMany({})

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
