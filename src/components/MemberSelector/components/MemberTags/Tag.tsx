import { Tooltip } from 'antd'
import React from 'react'
import './tag.less'

interface MemberTag {
  member: any
}
// 支持 成员 组织显示
const MemberTag = (props: MemberTag) => {
  const { member } = props
  debugger
  return (
    <Tooltip title={`${member.name}/${member.id}`}>
      <div className="member-tag">
        <span>{member.name || member.title}</span>/<span>{member.id || member.key}</span>
      </div>
    </Tooltip>
  )
}

export default MemberTag
