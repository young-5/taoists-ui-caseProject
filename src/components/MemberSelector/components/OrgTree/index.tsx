import { Tree } from 'antd'
import React, { useContext, useMemo, useState } from 'react'
import { SelectedMemberContext } from '../../context'

interface DataNode {
  title: string
  key: string
  isLeaf?: boolean
  children?: DataNode[]
}

const initTreeData: DataNode[] = [
  { title: '机构1', key: '0' },
  { title: '机构2', key: '1' },
  { title: '机构3', key: '2', isLeaf: true }
]

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
  const [treeData, setTreeData] = useState(initTreeData)
  const selectedMemberContext = useContext(SelectedMemberContext)
  const onLoadData = ({ key, children }: any) =>
    new Promise<void>((resolve) => {
      if (children) {
        resolve()
        return
      }
      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, key, [
            { title: `子机构${key}-0`, key: `${key}-0` },
            { title: `子机构${key}-1`, key: `${key}-1` }
          ])
        )

        resolve()
      }, 1000)
    })
  const selectedKeys = useMemo(() => {
    return [selectedMemberContext?.selectedOrg?.key]
  }, [selectedMemberContext.selectedOrg])
  const checkedKeys = useMemo(() => {
    return selectedMemberContext.checkedOrgs?.map((v) => v.key) || []
  }, [selectedMemberContext.checkedOrgs])

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
