import {
  BlogsMongooseModel,
  CommentsMongooseModel,
  LikesMongooseModel,
  PostsMongooseModel
} from '../../../../app/config/db'
import { PostsMappers } from '../mappers/PostsMappers'
import { PaginationAndSortQuery } from '../../../common/types'
import { commentsMappers } from '../../../comments'

export class QueryPostsRepository {
  constructor(protected postsMappers: PostsMappers) {}

  async getPosts(queryParams: PaginationAndSortQuery, blogId?: string, ) {
    const sortBy = queryParams.sortBy || 'createdAt'
    const sortDirection = ['asc', 'desc'].includes(queryParams.sortDirection ?? '') ? queryParams.sortDirection : 'desc'
    const pageNumber = Number(queryParams.pageNumber) || 1
    const pageSize = Number(queryParams.pageSize) || 10

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
    const mappedBlogs = foundPosts.map(this.postsMappers.mapDbPostsIntoView)

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
    const mappedPost = foundPost && this.postsMappers.mapDbPostsIntoView(foundPost)

    return mappedPost
  }
  async getPostBlogById(blogId: string) {
    const foundBlog = await BlogsMongooseModel.findById(blogId)
    const viewModelBlog = foundBlog && this.postsMappers.mapPostBlogToView(foundBlog)

    return viewModelBlog
  }
}
