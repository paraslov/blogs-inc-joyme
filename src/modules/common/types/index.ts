import { ResultToRouterStatus } from '../enums/ResultToRouterStatus'
import { Request } from 'express'
import * as core from 'express-serve-static-core'

export interface RequestBody<B> extends Request {
  body: B
}

export interface RequestParams<P extends core.ParamsDictionary> extends Request {
  params: P
}

export interface RequestParamsBody<P, B> extends Express.Request {
  params: P
  body: B
}

export interface RequestQuery<Q> extends Express.Request {
  query: Q
}

export interface RequestParamsQuery<P, Q> extends Express.Request {
  params: P
  query: Q
}

export type Pagination = {
  pagesCount?: number
  page?: number
  pageSize?: number
  totalCount?: number
}

export type PaginationWithItems<T> = Pagination & {
  items: T
}

export type PaginationQuery = {
  /**
   * pageNumber is number of portion that should be returned
   * Default value : 1
   */
  pageNumber?: number
  /**
   * pageSize is portion size that should be returned
   * Default value : 10
   */
  pageSize?: number
}

export type SortQuery = {
  /**
   * default createdAt
   */
  sortBy?: string
  /**
   * Default value: desc
   * Available values : asc, desc
   */
  sortDirection?: 'asc' | 'desc'
}

export type PaginationAndSortQuery = PaginationQuery & SortQuery

export type ResultToRouter<T = null> = {
  status: ResultToRouterStatus
  errorMessage?: string
  data: T | null
}
