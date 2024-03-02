import { ObjectId } from 'mongodb'
import { UsersQueryModel } from '../types/UsersQueryModel'
import { usersCollection } from '../../../../app/config/db'
import { usersMappers } from '../mappers/usersMappers'

export const usersQueryRepository = {
  async getUsers(payload: UsersQueryModel) {
    const queryParams: Required<UsersQueryModel> = {
      pageNumber: isNaN(Number(payload.pageNumber)) ? 1 : Number(payload.pageNumber),
      pageSize: isNaN(Number(payload.pageSize)) ? 10 : Number(payload.pageSize),
      sortBy: payload.sortBy ?? 'createdAt',
      sortDirection: payload.sortDirection === 'asc' ? 'asc' : 'desc',
      searchEmailTerm: payload.searchEmailTerm ?? null,
      searchLoginTerm: payload.searchLoginTerm ?? null,
    }
    let filter: any = { $or: [] }

    if (queryParams.searchLoginTerm) {
      filter.$or.push({ login: { $regex: queryParams.searchLoginTerm, $options: 'i' }})
    }
    if (queryParams.searchEmailTerm) {
      filter.$or.push({ email: { $regex: queryParams.searchEmailTerm, $options: 'i' }})
    }
    if (!filter.$or.length) {
      filter = {}
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
  },
  async getUserById(userId: string) {
    const foundUser = await usersCollection.findOne({ _id: new ObjectId(userId) })

    return foundUser && usersMappers.mapUserDbToViewDTO(foundUser)
  },
}
