import { PaginationAndSortQuery } from '../../../common/types'

export type UsersQueryModel = PaginationAndSortQuery & {
  /**
   * default: null
   */
  searchLoginTerm?: string | null
  /**
   * default: null
   */
  searchEmailTerm?: string | null
}
