import React, { FC, useContext, useMemo } from 'react'
import { SelectedMemberContext } from '../../context'
import Tag from '../MemberTags/Tag'
import './index.less'

interface SelectedMemberList {}
const SelectedMemberList: FC<SelectedMemberList> = () => {
  const selectedMemberContext = useContext(SelectedMemberContext)
  const allMerber: any = useMemo(() => {
    return [...selectedMemberContext.members, ...(selectedMemberContext?.checkedOrgs || [])]
  }, [selectedMemberContext.members, selectedMemberContext.checkedOrgs])
  return (
    <div className="selected-member-container">
      <div className="tags-hearder">
        <span>{`待成员 ( ${allMerber.length} )`}</span>
        <span
          className="clear"
          onClick={() => {
            selectedMemberContext.clearSelect()
          }}
        >
          清空
        </span>
      </div>
      <div className="member-tags">
        {allMerber.map((member) => {
          return <Tag member={allMerber} key={member.id} />
        })}
      </div>
    </div>
  )
}

export default SelectedMemberList
