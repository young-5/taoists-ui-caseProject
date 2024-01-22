import React from 'react'
import MemberSelector from '../components/MemberSelector'

/**
 * Primary UI component for user interaction
 */
export const Y5MemberSelector = () => {
  return (
    <MemberSelector
      title={'成员添加'}
      initMembers={[{ id: '111', name: '小五', roles: [], orgId: '111' }]}
    />
  )
}
