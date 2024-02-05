import { Router } from 'express'
import { blogsRepository } from '../repository/blogsRepository'
import { HttpStatusCode } from '../../common/enums'

export const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await blogsRepository.getAllBlogs()

  res.status(HttpStatusCode.OK_200).send(blogs)
})
