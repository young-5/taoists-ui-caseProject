import React, { FC } from 'react'
import { IMember as Member } from '../../type'
import Tag from './Tag'
import './index.less'

interface MemberTags {
  members: Member[]
  onDel?: (data: Member) => void
  isDel?: boolean
}
const MemberTags: FC<MemberTags> = (props) => {
  const { members, isDel, onDel } = props
  return (
    <div className="merber-tags-container">
      <div className="tags-hearder">{`已添加成员 ( ${members.length} )`}</div>
      <div className="member-tags">
        {members.map((member) => {
          return <Tag member={member} key={member.id} onDel={onDel} isDel={isDel} />
        })}
      </div>
    </div>
  )
}

export default MemberTags
