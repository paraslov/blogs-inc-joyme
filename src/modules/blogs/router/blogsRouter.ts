import { Response, Router } from 'express'
import { HttpStatusCode } from '../../common/enums'
import {
  PaginationAndSortQuery,
  RequestBody,
  RequestParamsBody,
  RequestParamsQuery,
  RequestQuery,
} from '../../common/types'
import { BlogInputModel } from '../model/types/BlogInputModel'
import { authMiddleware } from '../../../app/config/middleware'
import { blogIdValidationMW, blogInputValidation } from '../validations/blogsValidations'
import { blogsService } from '../model/services/blogsService'
import { queryBlogsRepository } from '../model/repositories/queryBlogsRepository'
import { BlogQueryModel } from '../model/types/BlogQueryModel'
import { postForBlogsInputValidation, PostInputModel, queryPostsRepository } from '../../posts'

export const blogsRouter = Router()

blogsRouter.get('/', async (req: RequestQuery<Partial<BlogQueryModel>>, res) => {
  const blogsQuery: BlogQueryModel = {
    searchNameTerm: req.query.searchNameTerm ?? null,
    sortBy: req.query.sortBy ?? 'createdAt',
    sortDirection: req.query.sortDirection ?? 'desc',
    pageNumber: Number(req.query.pageNumber) || 1,
    pageSize: Number(req.query.pageSize) || 10,
  }
  const blogs = await queryBlogsRepository.getAllBlogs(blogsQuery)

  res.status(HttpStatusCode.OK_200).send(blogs)
})

blogsRouter.get('/:blogId', blogIdValidationMW, async (req, res) => {
  const foundBlogById = await queryBlogsRepository.getBlogById(req.params.blogId)

  if (!foundBlogById) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  res.status(HttpStatusCode.OK_200).send(foundBlogById)
})

blogsRouter.get('/:blogId/posts', blogIdValidationMW,
  async (req: RequestParamsQuery<{ blogId: string }, PaginationAndSortQuery>, res: Response) => {
  const foundBlogById = await queryBlogsRepository.getBlogById(req.params.blogId)

  if (!foundBlogById) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  const foundPostsById = await queryPostsRepository.getPosts(req.query, req.params.blogId)

  res.status(HttpStatusCode.OK_200).send(foundPostsById)
})

blogsRouter.post('/', authMiddleware, blogInputValidation(), async (req: RequestBody<BlogInputModel>, res: Response) => {
  const newBlogData: BlogInputModel = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  }
  const createdBlogId = await blogsService.createBlog(newBlogData)
  const newBlog = await queryBlogsRepository.getBlogById(createdBlogId)

  if (!newBlog) {
    res.sendStatus(404)
  }

  res.status(HttpStatusCode.CREATED_201).send(newBlog)
})

blogsRouter.post('/:blogId/posts', authMiddleware, blogIdValidationMW, postForBlogsInputValidation(), async (req: RequestParamsBody<{ blogId: string }, Omit<PostInputModel, 'blogId'>>, res: Response) => {
  const createdPostId = await blogsService.createPostForBlog({...req.body, blogId: req.params.blogId})

  if (!createdPostId) {
    res.sendStatus(404)

    return
  }

  const newPost = await queryPostsRepository.getPostById(createdPostId)

  res.status(HttpStatusCode.CREATED_201).send(newPost)
})

blogsRouter.put('/:blogId', authMiddleware, blogIdValidationMW, blogInputValidation(), async (req: RequestParamsBody<{ blogId: string }, BlogInputModel>, res: Response) => {
  const isBlogUpdated = await blogsService.updateBlog(req.params.blogId, req.body)

  if (!isBlogUpdated) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

blogsRouter.delete('/:blogId', authMiddleware, blogIdValidationMW, async (req, res) => {
  const isDeleted = await blogsService.deleteBlog(req.params.blogId)

  if (!isDeleted) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
