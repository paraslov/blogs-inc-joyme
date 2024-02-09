import { app, db } from '../../../app/app'
import { RoutesList } from '../../../app/config/routes'
import { HttpStatusCode } from '../../common/enums'
import { testPost } from '../mocks/postsMock'

const supertest = require('supertest')

const request = supertest(app)

describe('/posts route GET tests: ', () => {
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })

  it('GET /posts', async () => {
    db.posts = [testPost]
    const result = await request.get(RoutesList.POSTS).expect(HttpStatusCode.OK_200)

    expect(result.body?.length).toBe(1)
    expect(result.body[0].blogId).toBe(testPost.blogId)
    expect(result.body[0].title).toBe(testPost.title)
  })
})
