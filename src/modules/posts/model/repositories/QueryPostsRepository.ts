import {
  BlogsMongooseModel,
  CommentsMongooseModel,
  LikesMongooseModel,
  PostsMongooseModel
} from '../../../../app/config/db'
import { PostsMappers } from '../mappers/PostsMappers'
import { PaginationAndSortQuery } from '../../../common/types'
import { commentsMappers, LikeStatuses } from '../../../comments'

export class QueryPostsRepository {
  constructor(protected postsMappers: PostsMappers) {}

  async getPosts(queryParams: Required<PaginationAndSortQuery>, blogId?: string, userId?: string | null) {
    const { sortBy, sortDirection, pageSize, pageNumber} = queryParams
    let filter: any = {}

    if (blogId) {
      filter.blogId = blogId
    }

    const foundPosts = await PostsMongooseModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    const totalCount = await PostsMongooseModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const mappedBlogsPromises = foundPosts.map(async (post) => {
      const likeStatus = userId ? await LikesMongooseModel.findOne({ userId, parentId: post._id.toString() }) : null

      let lastThreeLikes = await LikesMongooseModel
        .find({ parentId: post._id.toString() })
        .sort({ 'createdAt': -1 })

      const uniqueUsers: string[] = []
      lastThreeLikes = lastThreeLikes && lastThreeLikes.filter((like) => {
        const isUniqueLike = like.status === LikeStatuses.LIKE && !uniqueUsers.includes(like.userId) && uniqueUsers.length <= 3
        if (isUniqueLike) {
          uniqueUsers.push(like.userId)
        }

        return isUniqueLike
      })

      return this.postsMappers.mapDbPostsIntoView(post, likeStatus, lastThreeLikes)
    })

    const mappedBlogs = await Promise.all(mappedBlogsPromises)

    return {
      pageSize,
      pagesCount,
      totalCount,
      page: pageNumber,
      items: mappedBlogs,
    }
  }
  async getPostComments(postId: string, queryParams: Required<PaginationAndSortQuery>, userId?: string | null) {
    const { pageNumber, pageSize, sortBy, sortDirection} = queryParams
    const filter = { postId: postId }

    const foundComments = await CommentsMongooseModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    const totalCount = await CommentsMongooseModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)

    const mappedCommentsPromises = foundComments.map(async (comment) => {
      const likeStatus = userId ? await LikesMongooseModel.findOne({ userId, parentId: comment._id.toString() }) : null

      return commentsMappers.mapCommentDtoToViewModel(comment, likeStatus)
    })

    const mappedComments = await Promise.all(mappedCommentsPromises)

    return {
      pageSize,
      pagesCount,
      totalCount,
      page: pageNumber,
      items: mappedComments,
    }
  }
  async getPostById(postId: string) {
    const foundPost = await PostsMongooseModel.findById(postId)
    const mappedPost = foundPost && this.postsMappers.mapDbPostsIntoView(foundPost, null, null)

    return mappedPost
  }
  async getPostBlogById(blogId: string) {
    const foundBlog = await BlogsMongooseModel.findById(blogId)
    const viewModelBlog = foundBlog && this.postsMappers.mapPostBlogToView(foundBlog)

    return viewModelBlog
  }
  async getLikeStatus(userId: string, postId: string) {
    return LikesMongooseModel.findOne({ userId, parentId: postId })
  }
}
