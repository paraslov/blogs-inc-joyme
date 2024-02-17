import { Router, Response } from 'express'
import { HttpStatusCode } from '../../common/enums'
import { postsRepository } from '../model/repositories/postsRepository'
import { RequestBody, RequestParamsBody } from '../../common/types/RequestGenericTypes'
import { PostInputModel } from '../model/types/PostInputModel'
import { authMiddleware } from '../../../app/config/middleware'
import { postInputValidation } from '../validations/postsValidations'

export const postsRouter = Router()

postsRouter.get('/', async (req, res) => {
  const posts = await postsRepository.getAllPosts()

  res.status(HttpStatusCode.OK_200).send(posts)
})

postsRouter.get('/:postId', async (req, res) => {
  const foundPost = await postsRepository.getPostById(req.params.postId)

  if (!foundPost) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.status(HttpStatusCode.OK_200).send(foundPost)
})

postsRouter.post('/', authMiddleware, postInputValidation(),  async (req: RequestBody<PostInputModel>, res: Response) => {
  const payload: PostInputModel = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  }

  const createdPost = await postsRepository.createPost(payload)

  if (!createdPost) {
    res.sendStatus(HttpStatusCode.BAD_REQUEST_400)

    return
  }

  res.status(HttpStatusCode.CREATED_201).send(createdPost)
})

postsRouter.put('/:postId', authMiddleware, postInputValidation(),  async (req: RequestParamsBody<{ postId: string }, PostInputModel>, res: Response) => {
  const payload: PostInputModel = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
  }

  const isPostUpdated = await postsRepository.updatePost(payload, req.params.postId)

  if (!isPostUpdated) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

postsRouter.delete('/:postId', authMiddleware, async (req, res) => {
  const isDeleted = await postsRepository.deletePostById(req.params.postId)

  if (!isDeleted) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
