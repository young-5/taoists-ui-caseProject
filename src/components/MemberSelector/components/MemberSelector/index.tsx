import { Form } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { IMember, IMember as Member, Org, SEARCH_MEMBER_TYPE, SearchPamas } from '../../type'
import MemberTable from '../MemberTable'
import MemberTags from '../MemberTags/index'
import OrgTree from '../OrgTree'
import SearchBox from '../SearchBox/index'
import SearchMemberTable from '../SearchMemberTable'
import SelectedMemberList from '../SelectedMemberList'
import './index.less'

interface MemberSelector {
  initMembers: Member[] // 已经选择的成员
  onSubmit?: (data: Member[]) => void //提交
  // 获取部门接口
  fetchOrgs?: any
  // 获取用户接口
  fetchUsers?: any
  // 查询部门接口
  fetchSearchOrgs?: any
  // 查询用户接口
  fetchSearchUsers?: any
}

const MemberSelector = (props: MemberSelector, ref) => {
  const { initMembers, fetchOrgs, fetchUsers, fetchSearchOrgs, fetchSearchUsers } = props
  const [form] = Form.useForm()
  const [searchPamas, setSearchPamas] = useState<SearchPamas>() // 查询条件
  const [selectedMember, setSelectedMember] = useState<Member[]>([]) // 新选择的用户
  const [selectedOrg, setSelectedOrg] = useState<Org>() // 点击切换的部门
  const [checkedOrgs, setCheckedOrgs] = useState<Org[]>([]) // 选择的部门

  useImperativeHandle(ref, () => ({
    allSelectedMember: [...checkedOrgs, ...selectedMember]
  }))

  const searchSubmit = (val: SearchPamas) => {
    setSearchPamas(val)
  }
  const checkedMembersChange = (member: Member[]) => {
    setSelectedMember(member)
  }

  const selectedOrgChange = (org: Org) => {
    setSelectedOrg(org)
  }

  const checkedOrgsChange = (orgs: Org[]) => {
    // 排除 已选择的部门成员
    let newOrgs = orgs.filter((v) => !initMembers.find((m) => m.id === v.key))
    setCheckedOrgs(newOrgs)
  }
  const onDel = (member: IMember) => {
    if (member.membertType === 1) {
      let newMember = checkedOrgs.filter((v) => member.key !== v.key)
      checkedOrgsChange(newMember)
    } else {
      let newMember = selectedMember.filter((v) => member.id !== v.id)
      checkedMembersChange(newMember)
    }
  }
  const clearSelect = () => {
    setSelectedMember([])
    setCheckedOrgs([])
  }

  const SekectMemberProvider = {
    initMembers,
    members: selectedMember,
    clearSelect,
    checkedMembersChange,
    selectedOrgChange,
    selectedOrg,
    checkedOrgsChange,
    checkedOrgs,
    fetchOrgs: fetchOrgs,
    fetchUsers: fetchUsers,
    fetchSearchOrgs: fetchSearchOrgs,
    fetchSearchUsers: fetchSearchUsers,
    searchPamas
  }

  return (
    <SelectedMemberContext.Provider value={SekectMemberProvider}>
      <div className="member-selector-box">
        <div className="member-selector-box-tags">
          <MemberTags members={initMembers} />
        </div>
        <div className="member-selector-box-container">
          <div className="member-select">
            <div className="member-select-search">
              <SearchBox form={form} submit={searchSubmit} />
            </div>
            <div className="member-org">
              {searchPamas?.searchVal ? (
                <div className="search-member-list">
                  <SearchMemberTable />
                </div>
              ) : (
                <>
                  <div className="org-tree">
                    <OrgTree isCheck={searchPamas?.searchType === SEARCH_MEMBER_TYPE.ORG} />
                  </div>
                  <div className="org-members">
                    <MemberTable changeChecked={checkedMembersChange} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="select-member">
            <SelectedMemberList onDel={onDel} />
          </div>
        </div>
      </div>
    </SelectedMemberContext.Provider>
  )
}

export default forwardRef(MemberSelector)
