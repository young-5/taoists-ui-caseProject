import React, { FC, useContext, useMemo } from 'react'
import { SelectedMemberContext } from '../../context'
import { IMember, Org } from '../../type'
import Tag from '../MemberTags/Tag'
import './index.less'

interface SelectedMemberList {
  onDel: (data: IMember) => void
}
const SelectedMemberList: FC<SelectedMemberList> = ({ onDel }) => {
  const selectedMemberContext = useContext(SelectedMemberContext)
  const { checkedOrgs, members, checkedOrgsChange } = selectedMemberContext || {}
  const allMerber: IMember[] = useMemo(() => {
    let checked = checkedOrgs?.map((v) => ({ ...v, membertType: 1 })) || []
    return [...checked, ...members]
  }, [members, checkedOrgs])

  const onEdit = (node: Org, isNoContainSub: boolean) => {
    let _checkedOrgs: Org[] =
      checkedOrgs?.map((v) => {
        if (v.key === node.key) {
          v.isNoContainSub = isNoContainSub
          return v
        } else {
          return v
        }
      }) || []
    checkedOrgsChange?.([..._checkedOrgs])
  }
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
          let key = ''
          if ('id' in member) {
            key = member.id
          } else {
            key = member.key
          }
          return (
            <Tag
              member={member}
              key={key}
              isDel={true}
              onDel={onDel}
              onEdit={onEdit}
              isEdit={true}
            />
          )
        })}
      </div>
    </div>
  )
}

export default SelectedMemberList
