import { PaginationQuery, SortQuery } from '../../../common/types'

export type BlogQueryModel = PaginationQuery & SortQuery & {
  /**
   * (query)
   * Search term for blog Name: Name should contain this term in any position
   * Default value : null
   */
  searchNameTerm: string | null
}
