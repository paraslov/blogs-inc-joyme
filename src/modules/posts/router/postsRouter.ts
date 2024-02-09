import { Router } from 'express'
import { HttpStatusCode } from '../../common/enums'
import { postsRepository } from '../repository/postsRepository'

export const postsRouter = Router()

postsRouter.get('/', async (req, res) => {
  const posts = await postsRepository.getAllPosts()

  res.status(HttpStatusCode.OK_200).send(posts)
})
