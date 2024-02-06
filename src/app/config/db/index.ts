import { BlogViewModel } from '../../../modules/blogs'
import { testBlog } from '../../../modules/blogs/mocks/blogsMock'

type DbType = {
  blogs: BlogViewModel[],
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
