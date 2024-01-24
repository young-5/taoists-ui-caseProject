import { Tooltip } from 'antd'
import React from 'react'
import { IMember as Member } from '../../type'
import './tag.less'

interface MemberTag {
  member: Member
  isDel?: boolean
  onDel?: (data: Member) => void
}
// 支持 成员 部门显示
const MemberTag = (props: MemberTag) => {
  const { member, onDel, isDel = false } = props
  const renderDel = () => {
    return isDel ? (
      <span
        className="del"
        onClick={() => {
          console.log(onDel)
          onDel?.(member)
        }}
      >
        x
      </span>
    ) : null
  }
  const renderOrg = () => {
    return (
      <Tooltip title={`${member.name || member.title}`}>
        <div className="member-tag org-tag">
          <span className="span">{member.name || member.title}</span>
          {renderDel()}
        </div>
      </Tooltip>
    )
  }
  return member.membertType === 1 ? (
    renderOrg()
  ) : (
    <Tooltip title={`${member.name}/${member.id}`}>
      <div className="member-tag">
        <span className="span">{member.name || member.title}</span>/
        <span>{member.id || member.key}</span>
        {renderDel()}
      </div>
    </Tooltip>
  )
}

export default MemberTag
