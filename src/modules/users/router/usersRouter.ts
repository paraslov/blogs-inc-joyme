import { Router } from 'express'
import { RequestQuery } from '../../common/types'
import { UsersQueryModel } from '../model/types/UsersQueryModel'
import { queryUsersRepository } from '../model/repositories/queryUsersRepository'

export const usersRouter = Router()

usersRouter.get('/', async (req: RequestQuery<UsersQueryModel>, res) => {
  const foundUsers = await queryUsersRepository.getUsers(req.query)

  res.status(200).send(foundUsers)
})
