import { Button } from 'antd'
import React, { useState } from 'react'
import MemberSelector, { Member } from '../components/MemberSelector'

/**
 * Primary UI component for user interaction
 */
export const Y5MemberSelector = () => {
  const [open, setOpen] = useState(false)

  // 获取部门接口
  const fetchOrgs = (key?: string) => {
    return new Promise((res, rej) => {
      const initTreeData: any[] = key
        ? [
            { title: `子机构 ${key}-0`, key: `${key}-0`, pid: key + '' },
            { title: `子机构 ${key}-1`, key: `${key}-1`, pid: key + '' }
          ]
        : [
            { title: '机构 j0', key: 'j0' },
            { title: '机构 j1', key: 'j1' },
            { title: '机构 j2', key: 'j2', isLeaf: true }
          ]

      return res(initTreeData)
    })
  }
  // 获取用户接口
  const fetchUsers = (orgId) => {
    return new Promise((res, rej) => {
      return res(
        [
          {
            id: 'u1',
            name: 'John Brown'
          },
          {
            id: 'u2',
            name: 'Jim Green'
          },
          {
            id: 'u3',
            name: 'Joe Black'
          },
          {
            id: 'u4',
            name: 'Disabled User'
          }
        ].map((v) => {
          return { id: v.id + orgId, name: `${v.name}(${v.id + orgId})` }
        })
      )
    })
  }
  // 查询部门接口
  const fetchSearchOrgs = (key: string) => {
    return new Promise((res, rej) => {
      return res([
        {
          key: 'j1',
          title: `机构1${key}`,
          membertType: 1
        },
        {
          key: 'j2',
          title: '机构2',
          membertType: 1
        },
        {
          key: 'j1-1',
          title: '子机构ji-1',
          membertType: 1,
          pid: 'j1'
        }
      ])
    })
  }
  // 查询用户接口
  const fetchSearchUsers = (key: string) => {
    return new Promise((res, rej) => {
      const initTreeData: any[] = [
        {
          id: 'u1',
          name: `John Brown${key} u1`
        },
        {
          id: 'u2',
          name: 'Jim Green'
        },
        {
          id: 'u3',
          name: 'Joe Black'
        }
      ]
      return res(initTreeData)
    })
  }

  const onSubmit = (data: Member[]) => {
    console.log(data)
  }
  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true)
        }}
      >
        添加成员
      </Button>
      <MemberSelector
        title={'成员添加'}
        open={true}
        onSubmit={onSubmit}
        onCancel={() => {
          setOpen(false)
        }}
        initMembers={[
          { id: 'u1', name: 'John Brown' },
          {
            id: 'j1',
            name: '机构1',
            membertType: 1
          },
          {
            id: 'j1-1',
            name: '子机构 j1-1',
            membertType: 1
          }
        ]}
        fetchOrgs={fetchOrgs}
        fetchUsers={fetchUsers}
        fetchSearchUsers={fetchSearchUsers}
        fetchSearchOrgs={fetchSearchOrgs}
      />
    </div>
  )
}
