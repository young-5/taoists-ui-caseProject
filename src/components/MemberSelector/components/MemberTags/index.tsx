import React, { FC } from 'react'
import { Member } from '../../type'
import Tag from './Tag'
import './index.less'

interface MemberTags {
  members: Member[]
}
const MemberTags: FC<MemberTags> = (props) => {
  const { members } = props
  return (
    <div className="merber-tags-container">
      <div className="tags-hearder">{`已添加成员 ( ${members.length} )`}</div>
      <div className="member-tags">
        {members.map((member) => {
          return <Tag member={member} key={member.id} />
        })}
      </div>
    </div>
  )
}

export default MemberTags
