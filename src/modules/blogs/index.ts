import { blogsRouter } from './router/blogsRouter'
import { blogsQueryRepository } from './model/repositories/blogsQueryRepository'
import { BlogViewModel } from './model/types/BlogViewModel'
import { BlogDbModel } from './model/types/BlogDbModel'
import { testBlog } from './mocks/blogsMock'

export {
  blogsRouter,
  blogsQueryRepository,
  testBlog,
}

export type {
  BlogViewModel,
  BlogDbModel,
}
