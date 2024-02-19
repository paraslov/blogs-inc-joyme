export interface RequestBody<B> extends Express.Request {
  body: B
}

export interface RequestParams<P> extends Express.Request {
  params: P
}

export interface RequestParamsBody<P, B> extends Express.Request {
  params: P
  body: B
}

export interface RequestQuery<Q> extends Express.Request {
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
