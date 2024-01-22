import React, { FC } from 'react'
import { Member } from '../../type'
import MemberTags from '../MemberTags/index'
import './index.less'

interface MemberSelector {
  initMembers: Member[]
}

const MemberSelector: FC<MemberSelector> = (props) => {
  const { initMembers } = props
  return (
    <div className="member-selector-box">
      <div className="member-selector-box-tags">
        <MemberTags members={initMembers} />
      </div>
      <div className="member-selector-box-search">search</div>
      <div className="member-selector-box-container">
        <div className="org-tree">tree</div>
        <div className="org-members">user</div>
        <div className="select-member">select member</div>
      </div>
    </div>
  )
}

export default MemberSelector
