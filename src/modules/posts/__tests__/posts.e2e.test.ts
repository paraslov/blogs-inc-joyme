import { app, db } from '../../../app/app'
import { RoutesList } from '../../../app/config/routes'
import { HttpStatusCode } from '../../common/enums'
import { postsTestManager } from '../utils/testing/postsTestManager'
import { testBlog } from '../../blogs'
import { testPost, testPostInput } from '../mocks/postsMock'

const supertest = require('supertest')

const request = supertest(app)

describe('/posts route GET tests: ', () => {
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
    db.blogs.push(testBlog)
  })

  it('GET /posts success', async () => {
    const createdPost = await postsTestManager.createPost()
    const result = await request.get(RoutesList.POSTS).expect(HttpStatusCode.OK_200)

    expect(result.body?.length).toBe(1)
    expect(result.body[0].blogId).toBe(createdPost.body.blogId)
    expect(result.body[0].title).toBe(createdPost.body.title)
  })

  it('GET /posts/:id success', async () => {
    const createdPost = await postsTestManager.createPost()
    const result = await request.get(`${RoutesList.POSTS}/${createdPost.body.id}`).expect(HttpStatusCode.OK_200)

    expect(result.body.id).toStrictEqual(expect.any(String))
    expect(result.body.title).toBe(createdPost.body.title)
    expect(result.body.blogId).toBe(createdPost.body.blogId)
    expect(result.body.blogName).toBe(createdPost.body.blogName)
  })

  it('GET /posts/:id not found', async () => {
    await postsTestManager.createPost()
    await request.get(`${RoutesList.POSTS}/wrongId`).expect(HttpStatusCode.NOT_FOUND_404)
  })
})

describe('/posts route POST tests: ', () => {
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
    db.blogs = [testBlog]
  })

  it('POST /posts success', async () => {
    await postsTestManager.createPost({ shouldExpect: true })
  })

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
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'shortDescription', value: '' }
    })
  })

  it('POST /posts failed::content', async () => {
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'content', value: 123 }
    })
  })

  it('POST /posts failed::blogId', async () => {
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

describe('/posts PUT route tests: ', () => {
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
    db.blogs = [testBlog]
  })

  it('PUT /posts success', async () => {
    const createdPost = await postsTestManager.createPost()
    await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
      .auth('admin', 'qwerty')
      .send(testPostInput)
      .expect(HttpStatusCode.NO_CONTENT_204)
  })

  it('PUT /posts failed::unauthorized', async () => {
    await request.put(`${RoutesList.POSTS}/${testBlog.id}`)
      .send('wrong', 'auth')
      .expect(HttpStatusCode.UNAUTHORIZED_401)
  })

  it('PUT /posts failed::titleLength', async () => {
    const createdPost = await postsTestManager.createPost()
    const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
      .auth('admin', 'qwerty')
      .send({ ...testPostInput, title: '1234567890123456789012345678901' })
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('title')
    expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
  })

  it('PUT /posts failed::blogId', async () => {
    const createdPost = await postsTestManager.createPost()
    const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
      .auth('admin', 'qwerty')
      .send({ ...testPostInput, blogId: '000000' })
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('blogId')
    expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
  })

  it('PUT /posts failed::content', async () => {
    const createdPost = await postsTestManager.createPost()
    const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
      .auth('admin', 'qwerty')
      .send({ ...testPostInput, content: null })
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('content')
    expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
  })
})
