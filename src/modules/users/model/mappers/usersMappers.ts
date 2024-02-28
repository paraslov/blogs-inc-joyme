import { UserDbModel } from '../types/UserDbModel'
import { UserViewModel } from '../types/UserViewModel'
import { WithId } from 'mongodb'

export const usersMappers = {
  mapUserDbToViewDTO(dBUser: WithId<UserDbModel>): UserViewModel  {
    return {
      id: dBUser._id.toString(),
      login: dBUser.login,
      email: dBUser.email,
      createdAt: dBUser.createdAt,
    }
  }
}
