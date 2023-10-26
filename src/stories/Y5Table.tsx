import React from 'react'
import Table from '../components/Table'

interface Y5TableProps {
  fetchApi?: any
}

/**
 * Primary UI component for user interaction
 */
export const Y5Table = ({ fetchApi }: Y5TableProps) => {
  const columns: any = [
    {
      title: `名称`,
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>
    },
    {
      title: `地址`,
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: `姓名`,
      dataIndex: 'url',
      key: 'url'
    },
    {
      title: `年龄`,
      dataIndex: 'url',
      key: 'url'
    }
  ]
  return <Table fetchApi={false} columns={columns} searchPrams={{}} />
}
