export type BlogQueryModel = {
  /**
   * (query)
   * Search term for blog Name: Name should contain this term in any position
   * Default value : null
   */
  searchNameTerm: string | null
  /**
   * default createdAt
   */
  sortBy: string
  /**
   * Default value: desc
   * Available values : asc, desc
   */
  sortDirection: 'asc' | 'desc'
  /**
   * pageNumber is number of portion that should be returned
   * Default value : 1
   */
  pageNumber: number
  /**
   * pageSize is portion size that should be returned
   * Default value : 10
   */
  pageSize: number
}
