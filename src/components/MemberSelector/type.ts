export interface role {
  id: string
  roleName: string
}

export interface Member {
  id: string
  name: string
  roles?: role[]
  orgId?: string
  membertType?: string | number
}

export interface Org {
  key: string
  title: string
  membertType?: string | number
  pid: string
  isNoContainSub?: boolean
}

export enum SEARCH_MEMBER_TYPE {
  'USER' = 'user',
  'ORG' = 'org'
}

export interface SearchPamas {
  searchType: string
  searchVal: string
}

export interface Result<T> {
  code: number
  data: Array<T>
  total?: number
}

export type FetchApi<T> = (key?: string) => Promise<Result<T>>

export type IMember = Member | Org
