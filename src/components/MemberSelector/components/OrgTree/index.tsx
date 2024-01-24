import { ApartmentOutlined } from '@ant-design/icons'
import { Tooltip, Tree } from 'antd'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Org } from '../../type'
import './index.less'

interface DataNode {
  title: string
  key: string
  isLeaf?: boolean
  children?: DataNode[]
}

// It's just a simple demo. You can use tree map to optimize update perf.
const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children
      }
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      }
    }
    return node
  })

interface OrgTree {
  isCheck?: boolean
}
const OrgTree: React.FC<OrgTree> = (props) => {
  const { isCheck = false } = props
  const [treeData, setTreeData] = useState()
  const [checkedChildren, setCheckedChildren] = useState<Org[]>([])
  const treeMap = useRef<Record<string, Org[]>>({})
  const selectedMemberContext = useContext(SelectedMemberContext)
  const { selectedOrg, checkedOrgs, fetchOrgs, initMembers } = selectedMemberContext
  const getOrgs = async (id?: string) => {
    const data = await fetchOrgs(id)
    return data || []
  }
  const initFetch = async () => {
    await getOrgs().then((res: any) => {
      let initTreeData = res.map((v) => {
        if (initMembers?.find((m) => v.key === m.id)) {
          return { ...v, disableCheckbox: true }
        }
        return v
      })
      setTreeData(initTreeData)
    })
  }
  useEffect(() => {
    initFetch()
  }, [])
  const onLoadData = ({ key, children }: any) =>
    new Promise<void>(async (resolve) => {
      if (children) {
        resolve()
        return
      }
      // 已有成员 不可选择
      getOrgs?.(key).then((res: any) => {
        // 缓存  父 子 节点映射
        treeMap.current[key] = res
        let result = res.map((v) => {
          if (initMembers?.find((m) => v.key === m.id || v.pid === m.id)) {
            // 如果父级被选中，子节点默认选中
            return { ...v, disableCheckbox: true }
          }
          return v
        })
        setTreeData((origin) => updateTreeData(origin, key, result))
        resolve()
      })
    })

  const treeCheckedChange = (rows: any) => {
    // 选中父节点 ，子节点默认选中 （虚拟选中）
    let newChildren: Org[] = checkedChildren
    rows.checkedNodes.forEach((node) => {
      if (treeMap.current[node.key]) {
        newChildren = newChildren.concat(treeMap.current[node.key] as any)
      }
    })
    // 父节点取消 删除 虚拟选中的子节点 和 可操作
    newChildren = newChildren.filter((v) => rows.checkedNodes.find((m) => m.key === v.pid))

    setCheckedChildren(newChildren)
    // 子节点全部选中 父节点选中，子节点虚拟选中
    let checkedData = rows.checkedNodes.filter(
      (v) => !newChildren.find((m: any) => m.key === v.key)
    )
    selectedMemberContext.checkedOrgsChange?.(checkedData)
  }
  const selectedKeys = useMemo(() => {
    return [selectedOrg?.key]
  }, [selectedOrg])
  const checkedKeys = useMemo(() => {
    const newChecked = checkedOrgs?.map((v) => v.key) || [] // 新
    const prveChecked = initMembers?.map((v) => v.id) || [] // 已选
    let _checkedChildren: any = checkedChildren // 内部变价 记录的 子节点虚拟选中
    //外部选中变化 子节点选中处理
    if (!checkedOrgs?.length) {
      //清空
      setCheckedChildren([])
      _checkedChildren = []
    } else {
      // 可能是外部
      _checkedChildren = _checkedChildren.filter((v) => newChecked.includes(v.pid))
    }

    _checkedChildren = _checkedChildren?.map((v) => v.key)

    return [...newChecked, ...prveChecked, ..._checkedChildren]
  }, [checkedOrgs, initMembers])

  const titleRender = (nodeData: any) => {
    return (
      <div className="org-tree-title">
        <span>{nodeData.title}</span>
        <Tooltip title="默认包含子机构，可点击切换">
          <span className="icon" >
            <ApartmentOutlined />
          </span>
        </Tooltip>
      </div>
    )
  }

  return (
    <Tree
      loadData={onLoadData}
      treeData={treeData}
      titleRender={isCheck ? titleRender : undefined}
      blockNode={isCheck}
      selectedKeys={selectedKeys as React.Key[]}
      checkedKeys={checkedKeys as React.Key[]}
      onSelect={(_, selectedKeys: any) => {
        selectedMemberContext.selectedOrgChange?.(selectedKeys?.selectedNodes[0])
      }}
      onCheck={(_, rows: any) => {
        treeCheckedChange(rows)
      }}
      checkable={isCheck}
    />
  )
}

export default OrgTree
