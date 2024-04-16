import { Router } from 'express'
import { authMiddleware, jwtAuthMiddleware, sortingAndPaginationMiddleware } from '../../../app/config/middleware'
import { commentInputValidation, postIdValidationMW, postInputValidation } from '../validations/postsValidations'
import { PostsController } from '../model/controllers/PostsController'
import { postsService } from '../model/services/PostsService'
import { queryPostsRepository } from '../model/repositories/QueryPostsRepository'

export const postsRouter = Router()

const postsController = new PostsController(postsService, queryPostsRepository)

postsRouter.get('/', postsController.getPosts.bind(postsController))
postsRouter.get('/:postId', postIdValidationMW, postsController.getPostById.bind(postsController))
postsRouter.get(
  '/:postId/comments',
  postIdValidationMW,
  sortingAndPaginationMiddleware(),
  postsController.getPostComments.bind(postsController),
)
postsRouter.post('/', authMiddleware, postInputValidation(),  postsController.createPost.bind(postsController))
postsRouter.post(
  '/:postId/comments',
  postIdValidationMW,
  jwtAuthMiddleware,
  commentInputValidation(),
  postsController.createCommentToPost.bind(postsController),
)
postsRouter.put('/:postId', authMiddleware, postIdValidationMW, postInputValidation(),  postsController.updatePost.bind(postsController))
postsRouter.delete('/:postId', authMiddleware, postIdValidationMW, postsController.deletePost.bind(postsController))
