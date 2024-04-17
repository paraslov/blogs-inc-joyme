import {
  PaginationAndSortQuery,
  RequestBody,
  RequestParamsBody,
  RequestParamsQuery,
  RequestQuery
} from '../../../common/types'
import { Request, Response } from 'express'
import { HttpStatusCode } from '../../../common/enums'
import { PostInputModel } from '../types/PostInputModel'
import { PostsService } from '../services/PostsService'
import { CommentInputModel } from '../types/CommentInputModel'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import { commentsQueryRepository } from '../../../comments'
import { QueryPostsRepository } from '../repositories/QueryPostsRepository'

export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected queryPostsRepository: QueryPostsRepository,
  ) {}
  async getPosts(req: RequestQuery<PaginationAndSortQuery>, res: Response) {
    const posts = await this.queryPostsRepository.getPosts(req.query)

    res.status(HttpStatusCode.OK_200).send(posts)
  }
  async getPostById(req: Request, res: Response) {
    const foundPost = await this.queryPostsRepository.getPostById(req.params.postId)

    if (!foundPost) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    res.status(HttpStatusCode.OK_200).send(foundPost)
  }
  async getPostComments(req: RequestParamsQuery<{ postId: string }, Required<PaginationAndSortQuery>>, res: Response) {
    const post = await this.queryPostsRepository.getPostById(req.params.postId)

    if (!post) {
      return res.sendStatus(HttpStatusCode.NOT_FOUND_404)
    }

    const comments = await this.queryPostsRepository.getPostComments(req.params.postId, req.query)
    return res.status(HttpStatusCode.OK_200).send(comments)
  }
  async createPost(req: RequestBody<PostInputModel>, res: Response) {
    const createdPostId = await this.postsService.createPost(req.body)

    if (!createdPostId) {
      res.sendStatus(HttpStatusCode.BAD_REQUEST_400)
      return
    }

    const createdPost = await this.queryPostsRepository.getPostById(createdPostId)
    res.status(HttpStatusCode.CREATED_201).send(createdPost)
  }
  async createCommentToPost(req: RequestParamsBody<{ postId: string }, CommentInputModel>, res: Response) {
    const createCommentResult = await this.postsService.createCommentToPost(req.params.postId, req.userId, req.body)
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
    const isPostUpdated = await this.postsService.updatePost(req.body, req.params.postId)

    if (!isPostUpdated) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
  async deletePost(req: Request, res: Response) {
    const isDeleted = await this.postsService.deletePostById(req.params.postId)

    if (!isDeleted) {
      res.sendStatus(HttpStatusCode.NOT_FOUND_404)
      return
    }

    res.sendStatus(HttpStatusCode.NO_CONTENT_204)
  }
}
