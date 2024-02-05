import { blogsRouter } from '../../blogs'
import { app } from '../../../app'

const RoutesList = {
  BASE: '/',
  BLOGS: '/blogs',
  POSTS: '/posts',
  VERSION: '/version',
  TESTING: '/testing',
}

function initRoutes() {
  app.use(RoutesList.BLOGS, blogsRouter)
}

export {
  RoutesList,
  initRoutes,
}
