import { Modal } from 'antd'
import React, { FC, useRef } from 'react'
import MemberSelect from './components/MemberSelector'
import { FetchApi, IMember, Member, Org } from './type'

interface MemberSelector {
  title: string
  open: boolean
  onSubmit: (data: IMember[]) => void //提交
  onCancel: () => void
  initMembers: IMember[] // 已经选择的成员
  // 获取部门接口
  fetchOrgs?: FetchApi<Org[]>
  // 获取用户接口
  fetchUsers?: FetchApi<Member[]>
  // 查询部门接口
  fetchSearchOrgs?: FetchApi<Org[]>
  // 查询用户接口
  fetchSearchUsers?: FetchApi<Member[]>
}

const MemberSelector: FC<MemberSelector> = (props) => {
  const { title, open, onSubmit, onCancel, ...rest } = props
  const memberRef = useRef<{ allSelectedMember: IMember[] }>()
  const onOk = () => {
    const data = memberRef.current?.allSelectedMember || []
    onSubmit(data)
  }
  return (
    <Modal title={title} open={open} width={1200} onOk={onOk} onCancel={onCancel} destroyOnClose>
      <MemberSelect ref={memberRef} {...rest} />
    </Modal>
  )
}

export { IMember }

export default MemberSelector
