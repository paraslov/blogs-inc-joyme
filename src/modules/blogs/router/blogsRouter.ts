import { Router, Response } from 'express'
import { HttpStatusCode } from '../../common/enums'
import { RequestBody, RequestParamsBody } from '../../common/types/RequestGenericTypes'
import { BlogInputModel } from '../model/types/BlogInputModel'
import { authMiddleware } from '../../../app/config/middleware'
import { blogInputValidation } from '../validations/blogsValidations'
import { blogsService } from '../model/services/blogsService'
import { queryBlogsRepository } from '../model/repositories/queryBlogsRepository'
import { ObjectId } from 'mongodb'

export const blogsRouter = Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await queryBlogsRepository.getAllBlogs()

  res.status(HttpStatusCode.OK_200).send(blogs)
})

blogsRouter.get('/:blogId', async (req, res) => {
  const foundBlogById = await queryBlogsRepository.getBlogById(new ObjectId(req.params.blogId))

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
  const createdBlogId = await blogsService.createBlog(newBlogData)
  const newBlog = await queryBlogsRepository.getBlogById(new ObjectId(createdBlogId))

  if (!newBlog) {
    res.sendStatus(404)
  }

  res.status(HttpStatusCode.CREATED_201).send(newBlog)
})

blogsRouter.put('/:blogId', authMiddleware, blogInputValidation(), async (req: RequestParamsBody<{ blogId: string }, BlogInputModel>, res: Response) => {
  const isBlogUpdated = await blogsService.updateBlog(req.params.blogId, req.body)

  if (!isBlogUpdated) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.delete('/:blogId', authMiddleware, async (req, res) => {
  const isDeleted = await blogsService.deleteBlog(req.params.blogId)

  if (!isDeleted) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
