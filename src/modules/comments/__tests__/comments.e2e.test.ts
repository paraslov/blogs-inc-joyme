import { app } from '../../../app/app'
import { memoryService } from '../../common/services'
import { RoutesList } from '../../../app/config/routes'
import { postsTestManager } from '../../posts/utils/testing/postsTestManager'
import { HttpStatusCode } from '../../common/enums'
import { LikeStatuses } from '../model/enums/LikeStatuses'

const supertest = require('supertest')

const request = supertest(app)

describe('/comments route tests: ', () => {
  beforeAll(async () => {
    await memoryService.connect()
  })
  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await memoryService.close()
  })
  beforeEach(async () => {
    await request.delete(`${RoutesList.TESTING}/all-data`)
  })

  it('GET /comments/:commentId success', async () => {
    const { comment } = await postsTestManager.createComment()
    const result = await request.get(`${RoutesList.COMMENTS}/${comment.id}`).expect(HttpStatusCode.OK_200)
    console.log('@> result: ', result.body)

    expect(result.body.id).toBe(comment.id)
    expect(result.body.likesInfo.likesCount).toBe(0)
    expect(result.body.likesInfo.dislikesCount).toBe(0)
    expect(result.body.likesInfo.myStatus).toBe(LikeStatuses.NONE)
  })

  it('GET /comments/:commentId failed:notFound', async () => {
    await postsTestManager.createComment()
    await request.get(`${RoutesList.COMMENTS}/123456789012345678901234`).expect(HttpStatusCode.NOT_FOUND_404)
  })

  it('PUT /comments/:commentId success', async () => {
    const { comment, accessToken } = await postsTestManager.createComment()
    await request.put(`${RoutesList.COMMENTS}/${comment.id}`)
      .auth(accessToken, { type: 'bearer' })
      .send({ content: 'new comment content!!!' })
      .expect(HttpStatusCode.NO_CONTENT_204)
  })

  it('DELETE /comments/:commentId success', async () => {
    const { comment, accessToken } = await postsTestManager.createComment()
    await request.delete(`${RoutesList.COMMENTS}/${comment.id}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(HttpStatusCode.NO_CONTENT_204)

    await request.get(`${RoutesList.COMMENTS}/${comment.id}`).expect(HttpStatusCode.NOT_FOUND_404)
  })

  it('DELETE /comments/:commentId failed::notFound', async () => {
    const { comment, accessToken } = await postsTestManager.createComment()
    await request.delete(`${RoutesList.COMMENTS}/123456789012345678901234`)
      .auth(accessToken, { type: 'bearer' })
      .expect(HttpStatusCode.NOT_FOUND_404)

    await request.get(`${RoutesList.COMMENTS}/${comment.id}`).expect(HttpStatusCode.OK_200)
  })
})
