import { ApartmentOutlined, CompressOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import React from 'react'
import { IMember, Member, Org } from '../../type'
import './tag.less'

interface MemberTag {
  member: IMember
  isDel?: boolean
  onDel?: (data: IMember) => void
  isEdit?: boolean
  onEdit?: (data: Org, isNoContainSub: boolean) => void
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
    const { title, name, isNoContainSub } = member as Org
    return (
      <Tooltip title={title || name}>
        <div className="member-tag org-tag">
          <div className="tag-text">
            <span className="span">{title || name}</span>
            {isEdit && (
              <Tooltip title="默认包含子机构，可点击切换">
                <span
                  className="icon"
                  onClick={() => {
                    onEdit?.(member as Org, !isNoContainSub)
                  }}
                >
                  {isNoContainSub ? <CompressOutlined /> : <ApartmentOutlined />}
                </span>
              </Tooltip>
            )}
            {renderDel()}
          </div>
        </div>
      </Tooltip>
    )
  }

  const renderTag = () => {
    if (member.membertType === 1) {
      return renderOrg()
    } else {
      const { name, id } = member as Member
      return (
        <Tooltip title={`${name}/${id}`}>
          <div className="member-tag">
            <div className="tag-text">
              <span className="span">
                {name}/{id}
              </span>
            </div>
            {renderDel()}
          </div>
        </Tooltip>
      )
    }
  }

  return renderTag()
}

export default MemberTag
