import { ApartmentOutlined, CompressOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'
import { IMember as Member } from '../../type'
import './tag.less'

interface MemberTag {
  member: Member
  isDel?: boolean
  onDel?: (data: Member) => void
  isEdit?: boolean
  onEdit?: any
}
// 支持 成员 部门显示
const MemberTag = (props: MemberTag) => {
  const { member, onDel, isDel = false, isEdit = false, onEdit } = props
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
          <div className="tag-text">
            <span className="span">{member.name || member.title}</span>
            {isEdit && (
              <Tooltip title="默认包含子机构，可点击切换">
                <span
                  className="icon"
                  onClick={() => {
                    onEdit?.(member, !member.isNoContainSub)
                  }}
                >
                  {member.isNoContainSub ? <CompressOutlined /> : <ApartmentOutlined />}
                </span>
              </Tooltip>
            )}
            {renderDel()}
          </div>
        </div>
      </Tooltip>
    )
  }
  return member.membertType === 1 ? (
    renderOrg()
  ) : (
    <Tooltip title={`${member.name}/${member.id}`}>
      <div className="member-tag">
        <div className="tag-text">
          <span className="span">
            {member.name}/{member.id}
          </span>
        </div>
        {renderDel()}
      </div>
    </Tooltip>
  )
}

export default MemberTag
