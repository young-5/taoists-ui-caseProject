import type { TableColumnsType } from 'antd'
import { Table } from 'antd'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Member, Org, SEARCH_MEMBER_TYPE } from '../../type'
import './index.less'

type DataType = Member

interface SearchMemberTable {
  changeChecked: (values: Member[]) => void
}
interface MemberTable {}

const SearchMemberTable: React.FC<MemberTable> = (props) => {
  const selectedMemberContext = useContext(SelectedMemberContext)
  const { fetchSearchOrgs, fetchSearchUsers, initMembers, searchPamas } = selectedMemberContext
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<Member[]>([])
  const getData = async () => {
    let fun =
      searchPamas?.searchType === SEARCH_MEMBER_TYPE.USER ? fetchSearchUsers : fetchSearchOrgs
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
    return [
      ...(selectedMemberContext?.checkedOrgs || []).map((member: Org) => member.key),
      ...selectedMemberContext.members.map((member: Member) => member.id)
    ]
  }, [selectedMemberContext.checkedOrgs, selectedMemberContext.members])

  const columns: TableColumnsType<DataType> = [
    {
      title: '数据',
      dataIndex: 'name',
      render: (text: string) => (
        <div className="table-text">
          <div>
            <a>{text}</a>
          </div>

          <div className="text-desc">
            {searchPamas?.searchType === SEARCH_MEMBER_TYPE.USER ? '机构：xxx' : '描述：xxxxx'}
          </div>
        </div>
      )
    }
  ]
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      const prveCheckedMember = selectedMemberContext.members.filter((v) => {
        if (
          !dataSource.find((m) => m.id === v.id) ||
          (dataSource.find((m) => m.id === v.id) && selectedRowKeys.find((m) => m === v.id))
        ) {
          return true
        }
      })
      const newCheckedMember = selectedRows.filter(
        (v) => !selectedMemberContext.members.find((m) => m.id === v.id)
      )
      const allCheckedMember = [...prveCheckedMember, ...newCheckedMember]
      selectedMemberContext.checkedMembersChange?.(allCheckedMember as any)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: !!initMembers?.find((v) => v.id === record.id),
      id: record.id
    })
  }

  return (
    <Table
      loading={loading}
      rowKey={(row) => row.id}
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
