import type { TableColumnsType } from 'antd'
import { Table } from 'antd'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Member } from '../../type'

type DataType = Member

interface MemberTable {
  changeChecked: (values: Member[]) => void
}

const MemberTable: React.FC<MemberTable> = (props) => {
  const { changeChecked } = props

  const selectedMemberContext = useContext(SelectedMemberContext)
  const { fetchUsers, selectedOrg, members, initMembers } = selectedMemberContext
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<Member[]>([])
  const getUsers = async (id?: string) => {
    const orgId = id || selectedOrg?.key || ''
    const data = await fetchUsers?.(orgId)
    setDataSource(data)
    setLoading(false)
  }
  useEffect(() => {
    setLoading(true)
    getUsers()
  }, [selectedOrg])

  const columns: TableColumnsType<DataType> = [
    {
      title: `${selectedOrg?.title || ''}`,
      dataIndex: 'name',
      render: (text: string) => <a>{text}</a>
    }
  ]
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      // 不影响当前页数据之外的数据的选择中 处理
      const prveCheckedMember = members.filter((v) => {
        if (!dataSource.find((m) => m.id === v.id)) {
          return true
        }
      })
      //当前页数据   排除 已选
      const newCheckedMember = selectedRows.filter((v) => !initMembers?.find((m) => m.id === v.id))
      const allCheckedMember = [...prveCheckedMember, ...newCheckedMember]
      changeChecked(allCheckedMember as unknown as Member[])
    },
    getCheckboxProps: (record: DataType) => ({
      // 已有成员不得更改选择
      disabled: !!initMembers?.find((v: Member) => v.id === record.id),
      id: record.id
    })
  }

  let rowKeys = useMemo(() => {
    const selectMembers = members.map((member: Member) => member.id) || []
    const initMemberIds =
      initMembers?.filter((v: Member) => !v.membertType).map((member: Member) => member.id) || []
    return [...selectMembers, ...initMemberIds]
  }, [members])
  return (
    <Table
      loading={loading}
      rowKey={(row) => row.id}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: rowKeys,
        ...rowSelection
      }}
      size={'small'}
      columns={columns}
      dataSource={dataSource}
    />
  )
}

export default MemberTable
