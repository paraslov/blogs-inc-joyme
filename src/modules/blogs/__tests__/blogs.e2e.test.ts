import { app, db } from '../../../app/app'
import { RoutesList } from '../../../app/config/routes'
import { HttpStatusCode } from '../../common/enums'
import { testBlog, testBlogInput } from '../mocks/blogsMock'
import { blogsTestManager } from '../utils/tests/blogsTestManager'
const supertest = require('supertest')

const request = supertest(app)

describe('/blogs route tests:', () => {
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })

  it('GET /blogs', async () => {
    db.blogs = [testBlog]

    const result = await request.get(RoutesList.BLOGS).expect(HttpStatusCode.OK_200)

    expect(result.body?.length).toBe(1)
    expect(result.body).toStrictEqual([testBlog])
  })

  it('POST /blogs success', async () => {
    await blogsTestManager.createPost({ shouldExpect: true })
  })

  it('POST /blogs failed::unauthorized', async () => {
    await request.post(RoutesList.BLOGS)
      .auth('failed', 'password')
      .send(testBlogInput)
      .expect(HttpStatusCode.UNAUTHORIZED_401)

    expect(db.blogs.length).toBe(0)
  })

  it('POST /blogs failed::name:notString', async () => {
    const res = await request.post(RoutesList.BLOGS)
      .auth('admin', 'qwerty')
      .send({...testBlogInput, name: null})
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('name')
    expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    expect(db.blogs.length).toBe(0)
  })

  it('POST /blogs failed::name:tooLong', async () => {
    const res = await request.post(RoutesList.BLOGS)
      .auth('admin', 'qwerty')
      .send({...testBlogInput, name: '1234567890123456'})
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('name')
    expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    expect(db.blogs.length).toBe(0)
  })

  it('POST /blogs failed::description:emptyString', async () => {
    const res = await request.post(RoutesList.BLOGS)
      .auth('admin', 'qwerty')
      .send({...testBlogInput, description: ''})
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('description')
    expect(res.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
    expect(db.blogs.length).toBe(0)
  })

  it('POST /blogs failed::websiteUrl:incorrectUrl', async () => {
    const res = await request.post(RoutesList.BLOGS)
      .auth('admin', 'qwerty')
      .send({...testBlogInput, websiteUrl: 'https//my-website.top'})
      .expect(HttpStatusCode.BAD_REQUEST_400)

    expect(res.body.errorsMessages.length).toBe(1)
    expect(res.body.errorsMessages[0].field).toBe('websiteUrl')
    expect(res.body.errorsMessages[0].message).toBe('Must be a valid URL')
    expect(db.blogs.length).toBe(0)
  })

  it('GET /blogs/:id success', async () => {
    const createdBlog = await blogsTestManager.createPost()

    const result = await request.get(`${RoutesList.BLOGS}/${createdBlog.body.id}`).expect(HttpStatusCode.OK_200)

    expect(result.body.websiteUrl).toBe(testBlogInput.websiteUrl)
    expect(result.body.id).toStrictEqual(expect.any(String))
    expect(result.body.id).toBe(createdBlog.body.id)
  })

  it('GET /blogs/:id 404 not found', async () => {
    await blogsTestManager.createPost()

    await request.get(`${RoutesList.BLOGS}/someId`).expect(HttpStatusCode.NOT_FOUND_404)
  })
})
