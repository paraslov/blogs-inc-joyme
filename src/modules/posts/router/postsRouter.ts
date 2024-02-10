import { Router, Response } from 'express'
import { HttpStatusCode } from '../../common/enums'
import { postsRepository } from '../repository/postsRepository'
import { RequestBody } from '../../common/types/RequestGenericTypes'
import { PostInputModel } from '../model/PostInputModel'
import { authMiddleware } from '../../../app/config/middleware'
import { postInputValidation } from '../validations/postsValidations'

export const postsRouter = Router()

postsRouter.get('/', async (req, res) => {
  const posts = await postsRepository.getAllPosts()

  res.status(HttpStatusCode.OK_200).send(posts)
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
