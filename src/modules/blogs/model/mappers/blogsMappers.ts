import { WithId } from 'mongodb'
import { BlogDbModel } from '../types/BlogDbModel'
import { BlogViewModel } from '../types/BlogViewModel'

export const blogsMappers = {
  mapBlogToView(blogFromDb: WithId<BlogDbModel>): BlogViewModel {
    return {
      id: blogFromDb._id.toString(),
      name: blogFromDb.name,
      description: blogFromDb.description,
      websiteUrl: blogFromDb.websiteUrl,
      createdAt: blogFromDb.createdAt,
      isMembership: blogFromDb.isMembership,
    }
  }
}
