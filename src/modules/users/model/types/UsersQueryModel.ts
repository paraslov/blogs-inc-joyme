import { PaginationAndSortQuery } from '../../../common/types'

export type UsersQueryModel = PaginationAndSortQuery & {
  /**
   * default: null
   */
  searchLoginTerm: string
  /**
   * default: null
   */
  searchEmailTerm: string
}
