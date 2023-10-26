import * as React from 'react'
import { useCallback, useEffect, useReducer } from 'react'
import { Table } from 'antd'

interface ItableProps {
  baseProps?: any
  searchPrams?: any
  fetchApi?: any
  columns: any
  [key: string]: any
}

const TableCP: React.FC<ItableProps> = (props) => {
  const { baseProps, fetchApi, searchPrams = {}, columns, ...restProps } = props
  const page = {
    current: 1,
    pageSize: 10,
    total: 0
  }

  const initState = {
    loading: false,
    pagination: page,
    dataSource: []
  }

  const reducer = (state, action) => {
    const { payload } = action
    switch (action.type) {
      case 'TADLE_LOADING': // loading
        return { ...state, loading: payload.loading }
      case 'SET_PAGE': // page
        return { ...state, pagination: payload.pagination }
      case 'SET_DATASOURCE': // dataSouce
        return { ...state, dataSource: payload.dataSource }
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(reducer, initState)
  // 获取数据
  const fetchFun = async (page?: { pageSize?: number; current?: number }) => {
    const { pageSize, current } = page || {}
    if (fetchApi) {
      dispatch({
        type: 'TADLE_LOADING',
        payload: {
          loading: true
        }
      })
      // 是否重置分页
      let isRsetPage = searchPrams.resetPage
      delete searchPrams.resetPage
      let _page = current
      if (!current) {
        if (isRsetPage) {
          _page = 1
        } else {
          _page = state.pagination.current
        }
      }
      let res = await fetchApi({
        ...searchPrams,
        page: _page,
        pageSize: pageSize || state.pagination?.pageSize
      }).catch((err) => {
        console.log(err)
        return false
      })
      dispatch({
        type: 'TADLE_LOADING',
        payload: {
          loading: false
        }
      })
      if (res) {
        // 删除操作 删除当前页面最后一条数据 需要查询前一页数据
        const { page, pageSize, total } = res
        if (page && res.data?.length === 0) {
          let isLastPage = page > 1 && (page - 1) * pageSize >= total
          if (isLastPage) {
            fetchDataWarp({ current: page - 1, pageSize })
          }
        }

        dispatch({
          type: 'SET_PAGE',
          payload: {
            pagination: {
              ...state.pagination,
              pageSize: res.pageSize || pageSize,
              current: res.page || current,
              total: res?.total
            }
          }
        })
        dispatch({
          type: 'SET_DATASOURCE',
          payload: {
            dataSource: res.data || res
          }
        })
      }
    }
  }
  // searchPrams 变化 分页是否重置？
  // 数据操作：增删查改  分页是否重置？
  const fetchDataWarp = useCallback(fetchFun, [
    // state?.pagination?.current,
    // state.pagination?.pageSize,
    searchPrams,
    // columns,
    fetchApi
  ])
  // 页码变化
  const handleTableChnage = (payload: any) => {
    if (payload) {
      const { current, pageSize } = payload
      dispatch({
        type: 'SET_PAGE',
        payload: {
          pagination: {
            ...state.pagination,
            current,
            pageSize
          }
        }
      })
      fetchDataWarp({ current, pageSize })
    }
  }
  // 自己改变 触发
  useEffect(() => {
    fetchDataWarp()
  }, [fetchDataWarp])
  return (
    <div>
      <Table
        rowKey={(record) => record.id}
        columns={Array.isArray(columns) ? columns : columns(fetchFun)}
        dataSource={state.dataSource}
        loading={state.loading}
        onChange={handleTableChnage}
        pagination={{
          ...state.pagination,
          showTitle: true,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50, 100]
        }}
        {...restProps}
        {...baseProps}
      />
    </div>
  )
}

export default React.memo(TableCP)
