import { app, db } from '../../../app/app'
import { RoutesList } from '../../../app/config/routes'
import { HttpStatusCode } from '../../common/enums'
import { testPost } from '../mocks/postsMock'
import { postsTestManager } from '../utils/testing/postsTestManager'
import { testBlog } from '../../blogs'

const supertest = require('supertest')

const request = supertest(app)

describe('/posts route GET tests: ', () => {
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })

  it('GET /posts success', async () => {
    db.posts = [testPost]
    const result = await request.get(RoutesList.POSTS).expect(HttpStatusCode.OK_200)

    expect(result.body?.length).toBe(1)
    expect(result.body[0].blogId).toBe(testPost.blogId)
    expect(result.body[0].title).toBe(testPost.title)
  })
})

describe('/posts route POST tests: ', () => {
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })
  //
  // it('POST /posts success', async () => {
  //   await postsTestManager.createPost()
  // })

  it('POST /posts failed::auth', async () => {
    await postsTestManager.createPost({
      user: 'badUser',
      password: 'badPassword',
      expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
    })
    await postsTestManager.createPost({
      password: 'badPassword',
      expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
    })
    await postsTestManager.createPost({
      user: 'badUser',
      expectedStatusCode: HttpStatusCode.UNAUTHORIZED_401,
    })
  })

  it('POST /posts failed::title', async () => {
    db.blogs = [testBlog]
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'title', value: null }
    })
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'title', value: '1234567890123456789012345678901' }
    })
  })

  it('POST /posts failed::shortDescription', async () => {
    db.blogs = [testBlog]
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'shortDescription', value: '' }
    })
  })

  it('POST /posts failed::content', async () => {
    db.blogs = [testBlog]
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'content', value: 123 }
    })
  })

  it('POST /posts failed::blogId', async () => {
    db.blogs = [testBlog]
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'blogId', value: '182736' }
    })
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'blogId', value: null }
    })
  })
})
