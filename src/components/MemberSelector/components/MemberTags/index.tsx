import React, { FC } from 'react'
import { IMember } from '../../type'
import Tag from './Tag'
import './index.less'

interface MemberTags {
  members: IMember[]
  onDel?: (data: IMember) => void
  isDel?: boolean
}
const MemberTags: FC<MemberTags> = (props) => {
  const { members, isDel, onDel } = props
  return (
    <div className="merber-tags-container">
      <div className="tags-hearder">{`已添加成员 ( ${members.length} )`}</div>
      <div className="member-tags">
        {members.map((member: IMember) => {
          let key = ''
          if ('id' in member) {
            key = member.id
          } else {
            key = member.key
          }
          return <Tag member={member} key={key} onDel={onDel} isDel={isDel} />
        })}
      </div>
    </div>
  )
}

export default MemberTags
