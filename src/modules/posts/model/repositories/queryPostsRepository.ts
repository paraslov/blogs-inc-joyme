import { postsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { postsMappers } from '../mappers/postsMappers'
import { PaginationQuery, SortQuery } from '../../../common/types'

export const queryPostsRepository = {
  async getAllPosts() {
    const posts = await postsCollection.find({}).toArray()

    return posts.map(postsMappers.mapDbPostsIntoView)
  },
  async getPostByBlogId(blogId: string, queryParams: PaginationQuery & SortQuery) {
    const sortBy = queryParams.sortBy ?? 'createdAt'
    const sortDirection = queryParams.sortDirection ?? 'desc'
    const pageNumber = Number(queryParams.pageNumber) ?? 1
    const pageSize = Number(queryParams.pageSize) ?? 10

    let filter: any = { blogId: blogId }

    const foundPosts = await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    const totalCount = await postsCollection.countDocuments()
    const pagesCount = Math.ceil(totalCount / pageSize)
    const mappedBlogs = foundPosts.map(postsMappers.mapDbPostsIntoView)

    return {
      pageSize,
      pagesCount,
      totalCount,
      page: pageNumber,
      items: mappedBlogs,
    }
  },
  async getPostById(postId: string) {
    const foundPost = await postsCollection.findOne({ _id: new ObjectId(postId) })
    const mappedPost = foundPost && postsMappers.mapDbPostsIntoView(foundPost)

    return mappedPost
  },
}
