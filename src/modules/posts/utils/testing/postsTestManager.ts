import { RoutesList } from '../../../../app/config/routes'
import { HttpStatusCode } from '../../../common/enums'
import { app, db } from '../../../../app/app'
import { testPostInput } from '../../mocks/postsMock'

const supertest = require('supertest')

const request = supertest(app)

class PostsTestManager {
  async createPost(payload: {
    shouldExpect?: boolean
    user?: string
    password?: string
    expectedStatusCode?: HttpStatusCode
    checkedData?: { field: string, value: any }
  } = {}) {
    const {
      shouldExpect = false,
      user = 'admin',
      password = 'qwerty',
      expectedStatusCode = HttpStatusCode.CREATED_201,
      checkedData,
    } = payload

    const result = await request.post(RoutesList.POSTS)
      .auth(user, password)
      .send(checkedData ? { ...testPostInput, [checkedData.field]: checkedData.value } : testPostInput)
      .expect(expectedStatusCode)

    if (shouldExpect && expectedStatusCode === HttpStatusCode.CREATED_201) {
      expect(result.body.title).toBe(testPostInput.title)
      expect(result.body.blogId).toBe(testPostInput.blogId)
      expect(db.posts[0].shortDescription).toStrictEqual(testPostInput.shortDescription)
      expect(db.posts[0].id).toStrictEqual(expect.any(String))
    }

    if (shouldExpect && expectedStatusCode === HttpStatusCode.BAD_REQUEST_400 && checkedData?.field) {
      expect(result.body.errorsMessages.length).toBe(1)
      expect(result.body.errorsMessages[0].field).toBe(checkedData.field)
      expect(result.body.errorsMessages[0].message).toStrictEqual(expect.any(String))
      expect(db.posts.length).toBe(0)
    }

    return result
  }
}

export const postsTestManager = new PostsTestManager()
