import { BlogViewModel } from '../../../modules/blogs'
import { testBlog } from '../../../modules/blogs'
import { testPost } from '../../../modules/posts/mocks/postsMock'

type DbType = {
  blogs: BlogViewModel[],
  posts: any,
}

const createDB = (): DbType => {
  return {
    blogs: [testBlog],
    posts: [testPost],
  }
}

export {
  createDB,
}
