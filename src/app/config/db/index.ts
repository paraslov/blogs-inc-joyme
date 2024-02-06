import { BlogsViewModel } from '../../../modules/blogs'
import { testBlog } from '../../../modules/blogs/mocks/blogsMock'

type DbType = {
  blogs: BlogsViewModel[],
  posts: any,
}

const createDB = (): DbType => {
  return {
    blogs: [testBlog],
    posts: [],
  }
}

export {
  createDB,
}
