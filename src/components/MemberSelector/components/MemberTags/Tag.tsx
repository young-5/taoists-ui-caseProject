import { Tooltip } from 'antd'
import React from 'react'
import { Member } from '../../type'
import './tag.less'

interface MemberTag {
  member: Member
}
// 支持 成员 组织显示
const MemberTag = (props: MemberTag) => {
  const { member } = props
  return (
    <Tooltip title={`${member.name}/${member.id}`}>
      <div className="member-tag">
        <span>{member.name}</span>/<span>{member.id}</span>
      </div>
    </Tooltip>
  )
}

export default MemberTag
