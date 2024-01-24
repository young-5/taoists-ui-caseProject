import { Modal } from 'antd'
import React, { FC, useRef } from 'react'
import MemberSelect from './components/MemberSelector'
import { IMember as Member } from './type'

interface MemberSelector {
  title: string
  open: boolean
  onSubmit: (data: Member[]) => void //提交
  onCancel: () => void
  initMembers: Member[] // 已经选择的成员
  // 获取部门接口
  fetchOrgs?: any
  // 获取用户接口
  fetchUsers?: any
  // 查询部门接口
  fetchSearchOrgs?: any
  // 查询用户接口
  fetchSearchUsers?: any
}

const MemberSelector: FC<MemberSelector> = (props) => {
  const { title, open, onSubmit, onCancel, ...rest } = props
  const memberRef = useRef<{ allSelectedMember: any }>()
  const onOk = () => {
    let data = memberRef.current?.allSelectedMember
    onSubmit(data)
  }
  return (
    <Modal title={title} open={open} width={1200} onOk={onOk} onCancel={onCancel} destroyOnClose>
      <MemberSelect ref={memberRef} {...rest} />
    </Modal>
  )
}

export { Member }

export default MemberSelector
