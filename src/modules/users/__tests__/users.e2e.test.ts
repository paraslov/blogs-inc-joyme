import { app } from '../../../app/app'
import { RoutesList } from '../../../app/config/routes'
import { HttpStatusCode } from '../../common/enums'
import { usersTestManager } from '../utils/testing/usersTestManager'
import { client } from '../../../app/config/db'

const supertest = require('supertest')

const request = supertest(app)

describe('/users route GET tests: ', () => {
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

  it('GET /users success', async () => {
    const createdUser = await usersTestManager.createUser()
    const result = await request.get(RoutesList.USERS)
      .auth('admin', 'qwerty')
      .expect(HttpStatusCode.OK_200)

    expect(result.body.items?.length).toBe(1)
    expect(result.body.items[0].blogId).toBe(createdUser.body.blogId)
    expect(result.body.items[0].title).toBe(createdUser.body.title)
    expect(result.body.totalCount).toBe(1)
    expect(result.body.pageSize).toBe(10)
  })
})

describe('/users route POST tests: ', () => {
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

  it('POST /users success', async () => {
    await usersTestManager.createUser({ shouldExpect: true })
  })

  it('POST /users with same login check', async () => {
    await usersTestManager.createUser({ checkedData: { field: 'login', value: 'sameLogin' } })
    const result = await usersTestManager.createUser({
      checkedData: { field: 'login', value: 'sameLogin' },
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
    })

    expect(result.body.errorsMessages.find((err: any) => err.field === 'login').message)
      .toBe('This login is already exists')
  })

  it('POST /users with same email check', async () => {
    await usersTestManager.createUser({ checkedData: { field: 'email', value: 'sameEmail@gmail.com' } })
    const result = await usersTestManager.createUser({
      checkedData: { field: 'email', value: 'sameEmail@gmail.com' },
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
    })
    console.log('@> result: ', result.body)

    expect(result.body.errorsMessages.find((err: any) => err.field === 'email').message)
      .toBe('This email is already exists')
  })

  it('POST /users with wrong email format', async () => {
    await usersTestManager.createUser({
      checkedData: { field: 'email', value: 'sameEmail@111' },
      expectedStatusCode: HttpStatusCode.BAD_REQUEST_400,
      shouldExpect: true
    })
  })
})
