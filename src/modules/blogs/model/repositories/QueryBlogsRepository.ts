import { BlogsMongooseModel } from '../../../../app/config/db'
import { blogsMappers } from '../mappers/blogsMappers'
import { BlogQueryModel } from '../types/BlogQueryModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { PaginationWithItems } from '../../../common/types'

export class QueryBlogsRepository {
  static async getAllBlogs(queryParams: Required<BlogQueryModel>): Promise<PaginationWithItems<BlogViewModel[]>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = queryParams
    let filter: Partial<Record<keyof BlogViewModel, any>> = {}

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }

    const foundBlogs = await BlogsMongooseModel
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)

    const totalCount = await BlogsMongooseModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const mappedBlogs = foundBlogs.map(blogsMappers.mapBlogToView)

    return {
      pageSize,
      pagesCount,
      totalCount,
      page: pageNumber,
      items: mappedBlogs,
    }
  }
  static async getBlogById(blogId: string) {
    const foundBlog = await BlogsMongooseModel.findById(blogId)
    const viewModelBlog = foundBlog && blogsMappers.mapBlogToView(foundBlog)

    return viewModelBlog
  }
}
