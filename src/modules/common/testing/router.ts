import { Router } from 'express'
import { HttpStatusCode } from '../enums'
import { blogsCollection, postsCollection, usersCollection } from '../../../app/config/db'

export const testingRouter = Router()

testingRouter.delete('/all-data', async (req, res) => {
  await blogsCollection.deleteMany({})
  await postsCollection.deleteMany({})
  await usersCollection.deleteMany({})

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
