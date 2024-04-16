import { blogsRouter } from './router/blogsRouter'
import { BlogViewModel } from './model/types/BlogViewModel'
import { BlogDbModel } from './model/types/BlogDbModel'
import { testBlog } from './mocks/blogsMock'
import { queryBlogsRepository } from './composition-root/blogsCompostitionRoot'

export {
  blogsRouter,
  queryBlogsRepository,
  testBlog,
}

export type {
  BlogViewModel,
  BlogDbModel,
}
