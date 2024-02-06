import { app, db } from '../../../app/app'
import { RoutesList } from '../../../app/config/routes'
import { HttpStatusCode } from '../../common/enums'
import { testBlog } from '../mocks/blogsMock'
const supertest = require('supertest')

const request = supertest(app)

describe('/blogs route tests:', () => {
  it('GET /blogs', async () => {
    db.blogs = [testBlog]

    const result = await request.get(RoutesList.BLOGS).expect(HttpStatusCode.OK_200)

    expect(result.body?.length).toBe(1)
    expect(result.body).toStrictEqual([testBlog])
  })
})
