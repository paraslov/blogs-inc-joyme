import { app } from '../../../app/app'
import { RoutesList } from '../../../app/config/routes'
import { HttpStatusCode } from '../../common/enums'
import { postsTestManager } from '../utils/testing/postsTestManager'
import { testBlog } from '../../blogs'
import { postWrongId, testPostInput } from '../mocks/postsMock'
import { client, postsCollection } from '../../../app/config/db'

const supertest = require('supertest')

const request = supertest(app)

describe('/posts route GET tests: ', () => {
  beforeAll(async ()=> {
    await client.connect()
  })
  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await client.close()
  })
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })

  it('GET /posts success', async () => {
    const createdPost = await postsTestManager.createPost()
    const result = await request.get(RoutesList.POSTS).expect(HttpStatusCode.OK_200)

    expect(result.body.items?.length).toBe(1)
    expect(result.body.items[0].blogId).toBe(createdPost.body.blogId)
    expect(result.body.items[0].title).toBe(createdPost.body.title)
    expect(result.body.totalCount).toBe(1)
    expect(result.body.pageSize).toBe(10)
  })

  it('GET /posts success query params', async () => {
    await postsTestManager.createPost()
    const result = await request
      .get(RoutesList.POSTS)
      .query({
        pageNumber: 4,
        pageSize: 20,
      })
      .expect(HttpStatusCode.OK_200)

    expect(result.body.items?.length).toBe(0)
    expect(result.body.totalCount).toBe(1)
    expect(result.body.pageSize).toBe(20)
    expect(result.body.page).toBe(4)
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
    await request.get(`${RoutesList.POSTS}/${postWrongId}`).expect(HttpStatusCode.NOT_FOUND_404)
  })
})

describe('/posts route POST tests: ', () => {
  beforeAll(async ()=> {
    await client.connect()
  })
  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await client.close()
  })
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
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
      checkedData: { field: 'title', value: '1234567890123456789012345678901' },
    })
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'title', value: null },
    })
  })

  it('POST /posts failed::shortDescription', async () => {
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'shortDescription', value: '' },
    })
  })

  it('POST /posts failed::content', async () => {
    await postsTestManager.createPost({
      shouldExpect: true,
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      checkedData: { field: 'content', value: 123 },
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
  beforeAll(async ()=> {
    await client.connect()
  })
  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await client.close()
  })
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })

  it('PUT /posts success', async () => {
    const createdPost = await postsTestManager.createPost()
    await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
      .auth('admin', 'qwerty')
      .send({ ...testPostInput, blogId: createdPost.body.blogId })
      .expect(HttpStatusCode.NO_CONTENT_204)
  })

  it('PUT /posts failed::unauthorized', async () => {
    await request.put(`${RoutesList.POSTS}/${testBlog.id}`)
      .send('wrong', 'auth')
      .expect(HttpStatusCode.UNAUTHORIZED_401)
  })

  it('PUT /posts failed::unauthorized:Bearer', async () => {
    await request.put(`${RoutesList.POSTS}/${testBlog.id}`)
      .send('admin', 'qwerty', { type: "bearer" })
      .expect(HttpStatusCode.UNAUTHORIZED_401)
  })

  it('PUT /posts failed::titleLength', async () => {
    const createdPost = await postsTestManager.createPost()
    const res = await request.put(`${RoutesList.POSTS}/${createdPost.body.id}`)
      .auth('admin', 'qwerty')
      .send({ ...testPostInput, title: '1234567890123456789012345678901', blogId: createdPost.body.blogId })
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
      .send({ ...testPostInput, content: null, blogId: createdPost.body.blogId })
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('content')
    expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
  })
})

describe('/posts DELETE tests: ', () => {
  beforeAll(async ()=> {
    await client.connect()
  })
  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await client.close()
  })
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })

  it('DELETE /posts success: ', async () => {
    const createdPosts = await postsTestManager.createPost()

    await request.delete(`${RoutesList.POSTS}/${createdPosts.body.id}`)
      .auth('admin', 'qwerty')
      .expect(HttpStatusCode.NO_CONTENT_204)

    const posts = await postsCollection.find({}).toArray()

    expect(posts.length).toBe(0)
  })

  it('DELETE /posts failed::unauthorized: ', async () => {
    const createdPosts = await postsTestManager.createPost()

    await request.delete(`${RoutesList.POSTS}/${createdPosts.body.id}`)
      .auth('wrong', 'auth')
      .expect(HttpStatusCode.UNAUTHORIZED_401)

    const posts = await postsCollection.find({}).toArray()

    expect(posts.length).toBe(1)
  })

  it('DELETE /posts failed::notFoundPostId: ', async () => {
    await postsTestManager.createPost()

    await request.delete(`${RoutesList.POSTS}/${postWrongId}`)
      .auth('admin', 'qwerty')
      .expect(HttpStatusCode.NOT_FOUND_404)

    const posts = await postsCollection.find({}).toArray()

    expect(posts.length).toBe(1)

  })
})
