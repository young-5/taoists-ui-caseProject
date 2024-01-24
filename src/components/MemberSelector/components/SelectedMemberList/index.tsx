import React, { FC, useContext, useMemo } from 'react'
import { SelectedMemberContext } from '../../context'
import { IMember } from '../../type'
import Tag from '../MemberTags/Tag'
import './index.less'

interface SelectedMemberList {
  onDel: (data: IMember) => void
}
const SelectedMemberList: FC<SelectedMemberList> = ({ onDel }) => {
  const selectedMemberContext = useContext(SelectedMemberContext)
  const allMerber: any = useMemo(() => {
    let checked = selectedMemberContext?.checkedOrgs?.map((v) => ({ ...v, membertType: 1 })) || []
    return [...checked, ...selectedMemberContext.members]
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
          return <Tag member={member} key={member.id} isDel={true} onDel={onDel} />
        })}
      </div>
    </div>
  )
}

export default SelectedMemberList
