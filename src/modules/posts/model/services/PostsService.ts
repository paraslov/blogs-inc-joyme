import { commandPostsRepository } from '../repositories/CommandPostsRepository'
import { PostInputModel } from '../types/PostInputModel'
import { queryBlogsRepository } from '../../../blogs'
import { PostDbModel } from '../types/PostDbModel'
import { CommentInputModel } from '../types/CommentInputModel'
import { queryPostsRepository } from '../repositories/QueryPostsRepository'
import { ResultToRouterStatus } from '../../../common/enums/ResultToRouterStatus'
import { usersQueryRepository } from '../../../users'
import { CommentDbModel } from '../../../comments'

export class PostsService {
  async createPost(payload: PostInputModel) {
    const blogData = await queryBlogsRepository.getBlogById(payload.blogId)

    if (!blogData) return false

    const createdPostData: PostDbModel = {
      title: payload.title,
      shortDescription: payload.shortDescription,
      content: payload.content,
      blogId: payload.blogId,
      blogName: blogData.name,
      createdAt: new Date().toISOString(),
    }

    return commandPostsRepository.createPost(createdPostData)
  }
  async createCommentToPost(postId: string, userId: string, payload: CommentInputModel) {
    const post = await queryPostsRepository.getPostById(postId)
    const user = await usersQueryRepository.getUserById(userId)

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
    }

    const commentId = await commandPostsRepository.createCommentToPost(newComment)

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

    const foundBlog = await queryBlogsRepository.getBlogById(payload.blogId)

    if (!foundBlog) return false

    return commandPostsRepository.updatePost(updatePostData, postId)
  }
  async deletePostById(postId: string) {
    return commandPostsRepository.deletePostById(postId)
  }
}

export const postsService = new PostsService()
