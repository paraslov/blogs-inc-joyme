import { BlogsViewModel } from '../../blogs'

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

const testBlog: BlogsViewModel = {
  id: '666777',
  name: 'It-Incubator',
  description: 'Our blog about education in IT community',
  websiteUrl: 'https://it-incubator.io/',
}

export {
  createDB,
  testBlog,
}
