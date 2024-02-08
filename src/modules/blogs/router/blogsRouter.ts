import { Router, Response } from 'express'
import { blogsRepository } from '../repository/blogsRepository'
import { HttpStatusCode } from '../../common/enums'
import { RequestBody, RequestParams, RequestParamsBody } from '../../common/types/RequestGenericTypes'
import { BlogInputModel } from '../model/BlogInputModel'
import { authMiddleware } from '../../../app/config/middleware'
import { blogInputValidation } from '../validations/blogsValidations'

export const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await blogsRepository.getAllBlogs()

  res.status(HttpStatusCode.OK_200).send(blogs)
})

blogsRouter.get('/:blogId', async (req, res) => {
  const foundBlogById = await blogsRepository.getBlogById(req.params.blogId)

  if (!foundBlogById) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  res.status(HttpStatusCode.OK_200).send(foundBlogById)
})

blogsRouter.post('/', authMiddleware, blogInputValidation(), async (req: RequestBody<BlogInputModel>, res: Response) => {
  const newBlogData: BlogInputModel = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  }
  const newBlog = await blogsRepository.createNewBlog(newBlogData)

  res.status(HttpStatusCode.CREATED_201).send(newBlog)
})

blogsRouter.put('/:blogId', authMiddleware, blogInputValidation(), async (req: RequestParamsBody<{ blogId: string }, BlogInputModel>, res: Response) => {
  const updateBlogData: BlogInputModel = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  }

  const isBlogUpdated = await blogsRepository.updateBlog(req.params.blogId, updateBlogData)

  if (!isBlogUpdated) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
