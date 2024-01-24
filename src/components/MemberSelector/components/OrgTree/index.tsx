import { Tree } from 'antd'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { SelectedMemberContext } from '../../context'

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
        let result = res.map((v) => {
          if (initMembers?.find((m) => v.id === m.id)) {
            // 如果父级被选中，子节点默认选中
            return { ...v, disableCheckbox: true }
          }
          return v
        })
        setTreeData((origin) => updateTreeData(origin, key, result))
        resolve()
      })
    })
  const selectedKeys = useMemo(() => {
    return [selectedOrg?.key]
  }, [selectedOrg])
  const checkedKeys = useMemo(() => {
    return checkedOrgs?.map((v) => v.key) || []
  }, [checkedOrgs])

  return (
    <Tree
      loadData={onLoadData}
      treeData={treeData}
      selectedKeys={selectedKeys as React.Key[]}
      checkedKeys={checkedKeys as React.Key[]}
      onSelect={(_, selectedKeys: any) => {
        selectedMemberContext.selectedOrgChange?.(selectedKeys?.selectedNodes[0])
      }}
      onCheck={(_, rows: any) => {
        selectedMemberContext.checkedOrgsChange?.(rows.checkedNodes)
      }}
      checkable={isCheck}
    />
  )
}

export default OrgTree
