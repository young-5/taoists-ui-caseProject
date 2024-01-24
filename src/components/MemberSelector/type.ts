export interface role {
  id: string
  roleName: string
}

export interface Member {
  id: string
  name: string
  roles?: role[]
  orgId?: string
}

export interface Org {
  id: string
  title: string
  key: string
  membertType?: string | number
}

export enum SEARCH_MEMBER_TYPE {
  'USER' = 'user',
  'ORG' = 'org'
}

export interface SearchPamas {
  searchType: string
  searchVal: string
}

export type IMember = Member & Org
