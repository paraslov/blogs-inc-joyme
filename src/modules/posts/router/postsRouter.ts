import { Response, Router } from 'express'
import { HttpStatusCode } from '../../common/enums'
import { RequestBody, RequestParamsBody } from '../../common/types'
import { PostInputModel } from '../model/types/PostInputModel'
import { authMiddleware } from '../../../app/config/middleware'
import { postInputValidation } from '../validations/postsValidations'
import { queryPostsRepository } from '../model/repositories/queryPostsRepository'
import { postsService } from '../model/services/postsService'
import { ObjectId } from 'mongodb'

export const postsRouter = Router()

postsRouter.get('/', async (req, res) => {
  const posts = await queryPostsRepository.getAllPosts()

  res.status(HttpStatusCode.OK_200).send(posts)
})

postsRouter.get('/:postId', async (req, res) => {
  const foundPost = await queryPostsRepository.getPostById(new ObjectId(req.params.postId))

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

  const createdPost = await queryPostsRepository.getPostById(new ObjectId(createdPostId))

  res.status(HttpStatusCode.CREATED_201).send(createdPost)
})

postsRouter.put('/:postId', authMiddleware, postInputValidation(),  async (req: RequestParamsBody<{ postId: string }, PostInputModel>, res: Response) => {
  const isPostUpdated = await postsService.updatePost(req.body, new ObjectId(req.params.postId))

  if (!isPostUpdated) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})

postsRouter.delete('/:postId', authMiddleware, async (req, res) => {
  const isDeleted = await postsService.deletePostById(new ObjectId(req.params.postId))

  if (!isDeleted) {
    res.sendStatus(HttpStatusCode.NOT_FOUND_404)

    return
  }

  res.sendStatus(HttpStatusCode.NO_CONTENT_204)
})
