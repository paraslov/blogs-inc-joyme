import {
  PaginationAndSortQuery,
  RequestBody,
  RequestParamsBody,
  RequestParamsQuery,
  RequestQuery
} from '../../../common/types'
import { Request, Response } from 'express'
import { queryPostsRepository } from '../repositories/QueryPostsRepository'
import { HttpStatusCode } from '../../../common/enums'
import { PostInputModel } from '../types/PostInputModel'
import { postsService } from '../services/PostsService'
import { CommentInputModel } from '../types/CommentInputModel'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import { commentsQueryRepository } from '../../../comments'

export class PostsController {
  async getPosts(req: RequestQuery<PaginationAndSortQuery>, res: Response) {
    const posts = await queryPostsRepository.getPosts(req.query)

    res.status(HttpStatusCode.OK_200).send(posts)
  }
  async getPostById(req: Request, res: Response) {
    const foundPost = await queryPostsRepository.getPostById(req.params.postId)

    if (!foundPost) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    res.status(HttpStatusCode.OK_200).send(foundPost)
  }
  async getPostComments(req: RequestParamsQuery<{ postId: string }, Required<PaginationAndSortQuery>>, res: Response) {
    const post = await queryPostsRepository.getPostById(req.params.postId)

    if (!post) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    const comments = await queryPostsRepository.getPostComments(req.params.postId, req.query)
    return res.status(HttpStatusCode.OK_200).send(comments)
  }
  async createPost(req: RequestBody<PostInputModel>, res: Response) {
    const createdPostId = await postsService.createPost(req.body)

    if (!createdPostId) {
      res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
      return
    }

    const createdPost = await queryPostsRepository.getPostById(createdPostId)
    res.status(HttpStatusCode.CREATED_201).send(createdPost)
  }
  async createCommentToPost(req: RequestParamsBody<{ postId: string }, CommentInputModel>, res: Response) {
    const createCommentResult = await postsService.createCommentToPost(req.params.postId, req.userId, req.body)
    if (createCommentResult.status === ResultToRouterStatus.NOT_FOUND) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    const createdComment = await commentsQueryRepository.getCommentById(createCommentResult.data!.commentId)
    if (createdComment.status === ResultToRouterStatus.NOT_FOUND) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    return res.status(HttpStatusCode.CREATED_201).send(createdComment.data)
  }
  async updatePost(req: RequestParamsBody<{ postId: string }, PostInputModel>, res: Response) {
    const isPostUpdated = await postsService.updatePost(req.body, req.params.postId)

    if (!isPostUpdated) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
  async deletePost(req: Request, res: Response) {
    const isDeleted = await postsService.deletePostById(req.params.postId)

    if (!isDeleted) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
}
