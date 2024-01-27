import { createContext } from 'react'
import { FetchApi, Member, Org, SearchPamas } from './type'

interface SelectedMemberContext {
  initMembers?: Member[] // 已选择的成员
  members: Member[] // 新选择的成员
  checkedMembersChange?: (orgs: Member[]) => void // 用户成员选择变更
  clearSelect: () => void // 清空新选择的成员
  selectedOrgChange: (org: Org) => void // 点击机构回调
  checkedOrgsChange?: (orgs: Org[]) => void //机构成员选择变更
  selectedOrg?: Org // 点击选择的机构
  checkedOrgs?: Org[] // 先选择的机构成员
  // 获取部门接口
  fetchOrgs?: FetchApi<Org[]>
  // 获取用户接口
  fetchUsers?: FetchApi<Member[]>
  // 查询部门接口
  fetchSearchOrgs?: FetchApi<Org[]>
  // 查询用户接口
  fetchSearchUsers?: FetchApi<Member[]>
  // 查询参数
  searchPamas?: SearchPamas
}

export const SelectedMemberContext = createContext<SelectedMemberContext>({
  members: [],
  clearSelect: () => {},
  selectedOrgChange: () => {},
  checkedOrgs: []
})
