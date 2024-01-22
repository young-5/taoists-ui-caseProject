import { Modal } from 'antd'
import React, { FC } from 'react'
import MemberSelect from './components/MemberSelector'
import { Member } from './type'

interface MemberSelector {
  title: string
  onOk?: any // 确认回调
  getMemberFetch?: any // 获取成员
  getOrgFetch?: any // 获取组织架构
  initMembers: Member[]
}

const MemberSelector: FC<MemberSelector> = (props) => {
  const { title, initMembers = [] } = props
  return (
    <Modal title={title} open={true}>
      <MemberSelect initMembers={initMembers} />
    </Modal>
  )
}

export { Member }

export default MemberSelector
