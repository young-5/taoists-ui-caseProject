import { Form } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Member, Org, SEARCH_MEMBER_TYPE, SearchPamas } from '../../type'
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
  // 获取组织接口
  // 获取用户接口
  // 查询组织接口
  // 查询用户接口
}

const MemberSelector: FC<MemberSelector> = (props) => {
  const { initMembers } = props
  const [form] = Form.useForm()
  const [searchPamas, setSearchPamas] = useState<SearchPamas>()
  const [selectedMember, setSelectedMember] = useState<Member[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Org>()
  const [checkedOrgs, setCheckedOrgs] = useState<Org[]>()
  const searchSubmit = (val: SearchPamas) => {
    console.log(val)
    setSearchPamas(val)
  }
  useEffect(() => {
    console.log('更新')
  }, [searchPamas])
  const selectedMemberChange = (values: Member[]) => {
    setSelectedMember(values)
  }
  const clearSelect = () => {
    setSelectedMember([])
    setCheckedOrgs([])
  }
  const checkedMembersChange = (member: Member[]) => {
    setSelectedMember(member)
  }

  const selectedOrgChange = (org: Org) => {
    setSelectedOrg(org)
  }

  const checkedOrgsChange = (orgs: Org[]) => {
    setCheckedOrgs(orgs)
  }
  const SekectMemberProvider = {
    members: selectedMember,
    clearSelect,
    checkedMembersChange,
    selectedOrgChange,
    selectedOrg,
    checkedOrgsChange,
    checkedOrgs
  }
  const isSearch = () => {
    return searchPamas?.searchVal
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
              {isSearch() ? (
                <div className="search-member-list">
                  <SearchMemberTable />
                </div>
              ) : (
                <>
                  <div className="org-tree">
                    <OrgTree isCheck={searchPamas?.searchType === SEARCH_MEMBER_TYPE.ORG} />
                  </div>
                  <div className="org-members">
                    <MemberTable changeChecked={selectedMemberChange} />
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="select-member">
            <SelectedMemberList />
          </div>
        </div>
      </div>
    </SelectedMemberContext.Provider>
  )
}

export default MemberSelector
