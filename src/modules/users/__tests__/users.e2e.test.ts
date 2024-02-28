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
    expect(result.body.items[0].login).toBe(createdUser.body.login)
    expect(result.body.items[0].email).toBe(createdUser.body.email)
    expect(result.body.totalCount).toBe(1)
    expect(result.body.pageSize).toBe(10)
  })

  it('GET /users success email search', async () => {
    const createdUser = await usersTestManager.createUser()
    const result = await request.get(RoutesList.USERS)
      .auth('admin', 'qwerty')
      .query({
        searchEmailTerm: 'mye',
        searchLoginTerm: '123',
      })
      .expect(HttpStatusCode.OK_200)

    expect(result.body.items?.length).toBe(1)
    expect(result.body.items[0].login).toBe(createdUser.body.login)
    expect(result.body.items[0].email).toBe(createdUser.body.email)
    expect(result.body.totalCount).toBe(1)
    expect(result.body.pageSize).toBe(10)
  })

  it('GET /users success (200) login search with no results', async () => {
    const createdUser = await usersTestManager.createUser()
    const result = await request.get(RoutesList.USERS)
      .auth('admin', 'qwerty')
      .query({
        searchEmailTerm: 'yololo',
        searchLoginTerm: '123',
      })
      .expect(HttpStatusCode.OK_200)

    expect(result.body.items?.length).toBe(0)
    expect(result.body.totalCount).toBe(0)
    expect(result.body.pageSize).toBe(10)
  })

  it('GET /users failed::unathorized', async () => {
    await usersTestManager.createUser()
    await request.get(RoutesList.USERS)
      .expect(HttpStatusCode.UNAUTHORIZED_401)
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
