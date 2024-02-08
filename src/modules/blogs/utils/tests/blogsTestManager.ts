import { RoutesList } from '../../../../app/config/routes'
import { testBlogInput } from '../../mocks/blogsMock'
import { HttpStatusCode } from '../../../common/enums'
import { app, db } from '../../../../app/app'

const supertest = require('supertest')

const request = supertest(app)

class BlogsTestManager {
  private user = 'admin'
  private password = 'password'

  async createPost(payload?: { shouldExpect: boolean }) {
    const result =  await request.post(RoutesList.BLOGS)
      .auth(this.user, this.password)
      .send(testBlogInput)
      .expect(HttpStatusCode.CREATED_201)

    if (payload?.shouldExpect) {
      expect(result.body.name).toBe(testBlogInput.name)
      expect(result.body.websiteUrl).toBe(testBlogInput.websiteUrl)
      expect(db.blogs[0].description).toStrictEqual(testBlogInput.description)
      expect(db.blogs[0].id).toStrictEqual(expect.any(String))
    }

    return result
  }
}

export const blogsTestManager = new BlogsTestManager()
