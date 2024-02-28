import { PaginationAndSortQuery } from '../../../common/types'

export type BlogQueryModel = PaginationAndSortQuery & {
  /**
   * (query)
   * Search term for blog Name: Name should contain this term in any position
   * Default value : null
   */
  searchNameTerm: string | null
}
