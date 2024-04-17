import { CommandPostsRepository } from '../repositories/CommandPostsRepository'
import { PostInputModel } from '../types/PostInputModel'
import { PostDbModel } from '../types/PostDbModel'
import { CommentInputModel } from '../types/CommentInputModel'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import { CommentDbModel } from '../../../comments'
import { QueryPostsRepository } from '../repositories/QueryPostsRepository'
import { UsersQueryRepository } from '../../../users'

export class PostsService {
  constructor(
    protected queryPostsRepository: QueryPostsRepository,
    protected commandPostsRepository: CommandPostsRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  async createPost(payload: PostInputModel) {
    const blogData = await this.queryPostsRepository.getPostBlogById(payload.blogId)

    if (!blogData) return false

    const createdPostData: PostDbModel = {
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
      blogName: blogData.name,
      createdAt: new Date().toISOString(),
    }

    return this.commandPostsRepository.createPost(createdPostData)
  }
  async createCommentToPost(postId: string, userId: string, payload: CommentInputModel) {
    const post = await this.queryPostsRepository.getPostById(postId)
    const user = await this.usersQueryRepository.getUserById(userId)

    if (!(post && user)) {
      return {
        status: ResultToRouterStatus.NOT_FOUND
      }
    }

    const newComment: CommentDbModel = {
      postId,
      content: payload.content,
      commentatorInfo: {
        userId,
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
      likesCount: 0,
      dislikesCount: 0,
    }

    const commentId = await this.commandPostsRepository.createCommentToPost(newComment)

    return {
      status: ResultToRouterStatus.SUCCESS,
      data: { commentId },
    }
  }
  async updatePost(payload: PostInputModel, postId: string) {
    const updatePostData: PostInputModel = {
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
    }

    const foundBlog = await this.queryPostsRepository.getPostBlogById(payload.blogId)

    if (!foundBlog) return false

    return this.commandPostsRepository.updatePost(updatePostData, postId)
  }
  async deletePostById(postId: string) {
    return this.commandPostsRepository.deletePostById(postId)
  }
}
