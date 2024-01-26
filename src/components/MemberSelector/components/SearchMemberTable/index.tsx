import type { TableColumnsType } from 'antd'
import { Table } from 'antd'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Member, SEARCH_MEMBER_TYPE } from '../../type'
import './index.less'

type DataType = Member

interface SearchMemberTable {
  changeChecked: (values: Member[]) => void
}
interface MemberTable {}

const SearchMemberTable: React.FC<MemberTable> = (props) => {
  const selectedMemberContext = useContext(SelectedMemberContext)
  const { fetchSearchOrgs, fetchSearchUsers, initMembers, searchPamas } = selectedMemberContext
  const isUser = searchPamas?.searchType === SEARCH_MEMBER_TYPE.USER
  let id = isUser ? 'id' : 'key'
  const members: any = isUser ? selectedMemberContext.members : selectedMemberContext.checkedOrgs
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<Member[]>([])
  const getData = async () => {
    let fun = isUser ? fetchSearchUsers : fetchSearchOrgs
    const data: DataType[] = await fun(searchPamas?.searchVal)
    setTimeout(() => {
      setDataSource(data || [])
      setLoading(false)
    }, 1000)
  }
  useEffect(() => {
    setLoading(true)
    getData()
  }, [searchPamas])

  const allSelectedMember = useMemo(() => {
    const selectMembers = members.map((member: Member) => member[id]) || []
    const initMemberIds =
      initMembers
        ?.filter((v: any) => (isUser ? !v.membertType : v.membertType))
        .map((member: any) => member.id) || []
    return [...selectMembers, ...initMemberIds]
  }, [members])

  const columns: TableColumnsType<DataType> = [
    {
      title: '数据',
      dataIndex: isUser ? 'name' : 'title',
      render: (text: string) => (
        <div className="table-text">
          <div>
            <a>{text}</a>
          </div>

          <div className="text-desc">{isUser ? '机构：xxx' : '描述：xxxxx'}</div>
        </div>
      )
    }
  ]
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)

      const prveCheckedMember = members.filter((v) => {
        if (!dataSource.find((m) => m[id] === v[id])) {
          return true
        }
      })
      const newCheckedMember = selectedRows.filter((v) => !initMembers?.find((m) => m.id === v[id]))
      const allCheckedMember = [...prveCheckedMember, ...newCheckedMember]
      isUser
        ? selectedMemberContext.checkedMembersChange?.(allCheckedMember as any)
        : selectedMemberContext.checkedOrgsChange?.(allCheckedMember as any)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: !!initMembers?.find((v) => v.id === record[isUser ? 'id' : 'key']),
      id: record.id
    })
  }

  return (
    <Table
      loading={loading}
      rowKey={(row: any) => (isUser ? row.id : row.key)}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: allSelectedMember,
        ...rowSelection
      }}
      size={'small'}
      columns={columns}
      dataSource={dataSource}
    />
  )
}

export default SearchMemberTable
