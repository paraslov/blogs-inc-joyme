import { blogsRouter } from './router/blogsRouter'
import { queryBlogsRepository } from './model/repositories/queryBlogsRepository'
import { BlogViewModel } from './model/types/BlogViewModel'
import { BlogDbModel } from './model/types/BlogDbModel'
import { testBlog } from './mocks/blogsMock'

export {
  blogsRouter,
  queryBlogsRepository,
  testBlog,
}

export type {
  BlogViewModel,
  BlogDbModel,
}
