import { blogsRouter } from '../../../modules/blogs'
import { app } from '../../app'

const RoutesList = {
  BASE: '/',
  BLOGS: '/blogs',
  POSTS: '/posts',
  VERSION: '/version',
  TESTING: '/testing',
}

function initRoutes() {
  app.use(RoutesList.BLOGS, blogsRouter)

  app.get(RoutesList.BASE, (req, res) => {
    res.send('Welcome to JoymeStudios Blogs App!')
  })

  app.get(RoutesList.VERSION, (req, res) => {
    res.send('blogs-inc-joyme: v1.0.0')
  })
}

export {
  RoutesList,
  initRoutes,
}
