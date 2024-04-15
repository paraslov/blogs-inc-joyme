import { Response, Request, Router } from 'express'
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
import { BlogsService, blogsService } from '../model/services/BlogsService'
import { QueryBlogsRepository, queryBlogsRepository } from '../model/repositories/QueryBlogsRepository'
import { BlogQueryModel } from '../model/types/BlogQueryModel'
import { postForBlogsInputValidation, PostInputModel, queryPostsRepository } from '../../posts'

export const blogsRouter = Router()

class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected queryBlogsRepository: QueryBlogsRepository,
  ) {}
  async getUsers(req: RequestQuery<Partial<BlogQueryModel>>, res: Response) {
    const blogsQuery: Required<BlogQueryModel> = {
      searchNameTerm: req.query.searchNameTerm ?? null,
      sortBy: req.query.sortBy ?? 'createdAt',
      sortDirection: req.query.sortDirection ?? 'desc',
      pageNumber: Number(req.query.pageNumber) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    }
    const blogs = await this.queryBlogsRepository.getAllBlogs(blogsQuery)

    res.status(HttpStatusCode.OK_200).send(blogs)
  }
  async getUser(req: Request, res: Response) {
    const foundBlogById = await this.queryBlogsRepository.getBlogById(req.params.blogId)

    if (!foundBlogById) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    res.status(HttpStatusCode.OK_200).send(foundBlogById)
  }
  async getBlogById(req: RequestParamsQuery<{ blogId: string }, PaginationAndSortQuery>, res: Response) {
    const foundBlogById = await this.queryBlogsRepository.getBlogById(req.params.blogId)

    if (!foundBlogById) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    const foundPostsById = await queryPostsRepository.getPosts(req.query, req.params.blogId)
    res.status(HttpStatusCode.OK_200).send(foundPostsById)
  }
  async createBlog(req: RequestBody<BlogInputModel>, res: Response) {
    const newBlogData: BlogInputModel = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    }
    const createdBlogId = await this.blogsService.createBlog(newBlogData)
    const newBlog = await this.queryBlogsRepository.getBlogById(createdBlogId)

    if (!newBlog) {
      res.sendStatus(404)
    }
    res.status(HttpStatusCode.CREATED_201).send(newBlog)
  }
  async createPostForBlog(req: RequestParamsBody<{ blogId: string }, Omit<PostInputModel, 'blogId'>>, res: Response) {
    const createdPostId = await this.blogsService.createPostForBlog({...req.body, blogId: req.params.blogId})

    if (!createdPostId) {
      res.sendStatus(404)

      return
    }

    const newPost = await queryPostsRepository.getPostById(createdPostId)
    res.status(HttpStatusCode.CREATED_201).send(newPost)
  }
  async updateBlog(req: RequestParamsBody<{ blogId: string }, BlogInputModel>, res: Response) {
    const isBlogUpdated = await this.blogsService.updateBlog(req.params.blogId, req.body)

    if (!isBlogUpdated) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
  async deleteBlog(req: Request, res: Response) {
    const isDeleted = await this.blogsService.deleteBlog(req.params.blogId)

    if (!isDeleted) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
}
const blogsController = new BlogsController(blogsService, queryBlogsRepository)

blogsRouter.get('/', blogsController.getUsers.bind(blogsController))
blogsRouter.get('/:blogId', blogIdValidationMW, blogsController.getUser.bind(blogsController))
blogsRouter.get('/:blogId/posts', blogIdValidationMW, blogsController.getBlogById.bind(blogsController))
blogsRouter.post('/', authMiddleware, blogInputValidation(), blogsController.createBlog.bind(blogsController))
blogsRouter.post('/:blogId/posts', authMiddleware, blogIdValidationMW, postForBlogsInputValidation(), blogsController.createPostForBlog.bind(blogsController))
blogsRouter.put('/:blogId', authMiddleware, blogIdValidationMW, blogInputValidation(), blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:blogId', authMiddleware, blogIdValidationMW, blogsController.deleteBlog.bind(blogsController))
