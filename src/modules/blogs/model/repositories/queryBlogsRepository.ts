import { blogsCollection } from '../../../../app/config/db'
import { ObjectId } from 'mongodb'
import { blogsMappers } from '../mappers/blogsMappers'
import { BlogQueryModel } from '../types/BlogQueryModel'
import { BlogViewModel } from '../types/BlogViewModel'
import { PaginationWithItems } from '../../../common/types'

export const queryBlogsRepository = {
  async getAllBlogs(queryParams: BlogQueryModel): Promise<PaginationWithItems<BlogViewModel[]>> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = queryParams
    let filter: Partial<Record<keyof BlogViewModel, any>> = {}

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }

    const foundBlogs = await blogsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    const totalCount = await blogsCollection.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const mappedBlogs = foundBlogs.map(blogsMappers.mapBlogToView)

    return {
      pageSize,
      pagesCount,
      totalCount,
      page: pageNumber,
      items: mappedBlogs,
    }
  },
  async getBlogById(blogId: string) {
    const foundBlog = await blogsCollection.findOne({ _id: new ObjectId(blogId) })
    const viewModelBlog = foundBlog && blogsMappers.mapBlogToView(foundBlog)

    return viewModelBlog
  },
}
