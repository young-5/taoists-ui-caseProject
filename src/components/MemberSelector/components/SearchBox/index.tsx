import { Form, FormInstance, Input, Radio } from 'antd'
import React, { FC, useState } from 'react'
import { SEARCH_MEMBER_TYPE, SearchPamas } from '../../type'
import './index.less'

interface SearchBoxProps {
  form: FormInstance
  submit: (val: SearchPamas) => void
}

const MERBER_TYPES = [
  { label: '添加成员', value: SEARCH_MEMBER_TYPE.USER },
  { label: '添加部门', value: SEARCH_MEMBER_TYPE.ORG }
]

const SearchBox: FC<SearchBoxProps> = (props) => {
  const { form, submit } = props
  const [type, setType] = useState(SEARCH_MEMBER_TYPE.USER)
  const onValuesChange = (_, values) => {
    setType(values.searchType)
    submit(values)
  }
  return (
    <Form
      onValuesChange={onValuesChange}
      form={form}
      name="memberType"
      className="search-member-form"
      initialValues={{ searchType: SEARCH_MEMBER_TYPE.USER }}
    >
      <Form.Item name="searchType">
        <Radio.Group optionType="button" options={MERBER_TYPES} />
      </Form.Item>
      <Form.Item name="searchVal" style={{ flex: '1' }}>
        <Input.Search
          className="search-member-input"
          allowClear
          placeholder={type === SEARCH_MEMBER_TYPE.USER ? '请选择用户ID或名称' : '请输入部门名称'}
        />
      </Form.Item>
    </Form>
  )
}

export default SearchBox
