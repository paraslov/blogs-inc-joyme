import { Response, Router } from 'express'
import { HttpStatusCode } from '../../common/enums'
import {
  PaginationAndSortQuery,
  RequestBody,
  RequestParamsBody,
  RequestQuery,
} from '../../common/types'
import { PostInputModel } from '../model/types/PostInputModel'
import { authMiddleware } from '../../../app/config/middleware'
import { postIdValidationMW, postInputValidation } from '../validations/postsValidations'
import { queryPostsRepository } from '../model/repositories/queryPostsRepository'
import { postsService } from '../model/services/postsService'

export const postsRouter = Router()

postsRouter.get('/', async (req: RequestQuery<PaginationAndSortQuery>, res) => {
  const posts = await queryPostsRepository.getPosts(req.query)

  res.status(HttpStatusCode.OK_200).send(posts)
})

postsRouter.get('/:postId', postIdValidationMW, async (req, res) => {
  const foundPost = await queryPostsRepository.getPostById(req.params.postId)

  if (!foundPost) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.status(HttpStatusCode.OK_200).send(foundPost)
})

postsRouter.post('/', authMiddleware, postInputValidation(),  async (req: RequestBody<PostInputModel>, res: Response) => {
  const createdPostId = await postsService.createPost(req.body)

  if (!createdPostId) {
    res.sendStatus(HttpStatusCode.BAD_REQUEST_400)

    return
  }

  const createdPost = await queryPostsRepository.getPostById(createdPostId)

  res.status(HttpStatusCode.CREATED_201).send(createdPost)
})

postsRouter.put('/:postId', authMiddleware, postIdValidationMW, postInputValidation(),  async (req: RequestParamsBody<{ postId: string }, PostInputModel>, res: Response) => {
  const isPostUpdated = await postsService.updatePost(req.body, req.params.postId)

  if (!isPostUpdated) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

postsRouter.delete('/:postId', authMiddleware, postIdValidationMW, async (req, res) => {
  const isDeleted = await postsService.deletePostById(req.params.postId)

  if (!isDeleted) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
