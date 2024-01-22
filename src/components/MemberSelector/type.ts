export interface role {
  id: string
  roleName: string
}

export interface Member {
  id: string
  name: string
  roles: role[]
  orgId: string
}

export interface Org {
  id: string
  title: string
}
