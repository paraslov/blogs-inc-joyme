import { BlogViewModel } from '../../../modules/blogs'
import { PostViewModel } from '../../../modules/posts'
import { testBlog } from '../../../modules/blogs'
import { testPost } from '../../../modules/posts/mocks/postsMock'

type DbType = {
  blogs: BlogViewModel[],
  posts: PostViewModel[],
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
