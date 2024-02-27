import { UsersQueryModel } from '../types/UsersQueryModel'
import { UserViewModel } from '../types/UserViewModel'
import { usersCollection } from '../../../../app/config/db'
import { usersMappers } from '../mappers/usersMappers'

export const queryUsersRepository = {
  async getUsers(payload: UsersQueryModel) {
    const queryParams: UsersQueryModel = {
      pageNumber: isNaN(Number(payload.pageNumber)) ? 1 : Number(payload.pageNumber),
      pageSize: isNaN(Number(payload.pageSize)) ? 10 : Number(payload.pageSize),
      sortBy: payload.sortBy ?? 'createdAt',
      sortDirection: payload.sortDirection === 'asc' ? 'asc' : 'desc',
      searchEmailTerm: payload.searchEmailTerm ?? null,
      searchLoginTerm: payload.searchLoginTerm ?? null,
    }
    let filter: Partial<Record<keyof UserViewModel, any>> = {}

    if (queryParams.searchLoginTerm) {
      filter.login = { $regex: queryParams.searchLoginTerm, $options: 'i' }
    }
    if (queryParams.searchEmailTerm) {
      filter.email = { $regex: queryParams.searchEmailTerm, $options: 'i' }
    }

    const foundUsers = await usersCollection
      .find(filter)
      .sort({ [queryParams.sortBy]: queryParams.sortDirection === 'asc' ? 1 : -1 })
      .skip((queryParams.pageNumber - 1) * queryParams.pageSize)
      .limit(queryParams.pageSize)
      .toArray()

    const totalCount = await usersCollection.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / queryParams.pageSize)
    const mappedUsers = foundUsers.map(usersMappers.mapUserDbToViewDTO)

    return {
      pagesCount,
      totalCount,
      page: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      items: mappedUsers,
    }
  }
}
