import { ApartmentOutlined } from '@ant-design/icons'
import { Tooltip, Tree } from 'antd'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Org } from '../../type'
import './index.less'
import { deepClone, editTreeNode, editTreeNodeFields } from './treeHandle'

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
  checkStrictly?: boolean
}
const OrgTree: React.FC<OrgTree> = (props) => {
  const { isCheck = false, checkStrictly = true } = props
  const [treeData, setTreeData] = useState<any>()
  const [checkedChildren, setCheckedChildren] = useState<any>([])
  const treeMap = useRef<Record<string, Org[]>>({})
  const selectedMemberContext = useContext(SelectedMemberContext)
  const { selectedOrg, checkedOrgs, fetchOrgs, initMembers, searchPamas } = selectedMemberContext
  const getOrgs = async (id?: string) => {
    const data = await fetchOrgs(id)
    return data || []
  }
  // 初始化数据获取
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
  // tree 子节点 数据获取
  const onLoadData = ({ key, pid, children }: any) =>
    new Promise<void>(async (resolve) => {
      if (children) {
        resolve()
        return
      }
      getOrgs?.(key).then((res: any) => {
        // 缓存  父 子 节点映射
        treeMap.current[key] = res

        let newChildrenChecked: any = checkedChildren || {}
        // 已有成员 子节点虚拟选中且不可操作(可能是 已选节点的孙节点 不在 initMember中)
        if (initMembers?.find((el: any) => el.id === key)) {
          newChildrenChecked[key] = res
        }
        // 父节点被选中 子节点虚拟选中且不可操作
        if (checkedOrgs?.find((el) => el.key === key)) {
          newChildrenChecked[key] = res
        }
        // 孙节点处理
        if (res.length > 0) {
          if (checkedChildren[pid]) {
            newChildrenChecked[key] = res
          }
        }

        // tree 不可操作设置
        let result = res.map((v) => {
          // 已有成员  父 子 不可操作
          if (
            initMembers?.find((m) => v.key === m.id || v.pid === m.id) ||
            checkedChildren[v.pid]
          ) {
            // 如果父级被选中，子节点默认选中
            return { ...v, disableCheckbox: true }
          } else if (checkedOrgs?.find((el) => el.key === key)) {
            // 父节点选中 不可操作
            return { ...v, disableCheckbox: true }
          }
          return v
        })
        setCheckedChildren({ ...newChildrenChecked })
        setTreeData((origin) => updateTreeData(origin, key, result))
        resolve()
      })
    })

  // 父子节点关联
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
  // tree默认的父子节点关联已关闭
  const checkStrictlyCheckedChange = (rows) => {
    // 判断父节点 选中 是否包含子节点
    // 是 则子节点虚拟选中且不可操作
    // 否 则 父 子节点相互独立
    // 是否可点击 以及 是否包含子节点属性 记录在 treeData中
    // 子节点选中 包含着 checkedChildren中
    const { checked, node } = rows
    const currentNode = {
      //d点击的node节点
      title: node.title,
      checked: node.checked,
      key: node.key,
      pid: node.pid || ''
    }
    let newTreeData = deepClone(treeData)
    let newChildrenChecked = {}
    let newCheckedOrg: any[] = checkedOrgs || []
    if (checked) {
      newCheckedOrg?.push(currentNode)
      // 选中
      editTreeNode({
        node: currentNode,
        treeData: newTreeData,
        editField: { key: 'disableCheckbox', value: true },
        childrenChecked: newChildrenChecked
      })
    } else {
      newCheckedOrg = newCheckedOrg.filter((v) => v.key !== currentNode.key)
      // 取消
      editTreeNode({
        node: currentNode,
        treeData: newTreeData,
        editField: { key: 'disableCheckbox', value: null },
        childrenChecked: newChildrenChecked,
        isDel: true
      })
    }
    // 更新 tree (disableCheckbox)
    setTreeData(newTreeData)
    // 更新虚拟的选择组织
    setCheckedChildren(newChildrenChecked)
    // 更新 选择的组织
    selectedMemberContext.checkedOrgsChange?.(newCheckedOrg)
  }
  const selectedKeys = useMemo(() => {
    return [selectedOrg?.key]
  }, [selectedOrg])

  // 选中数据 新选 虚拟选中 已选
  const checkedKeys = useMemo(() => {
    const newChecked = checkedOrgs?.map((v) => v.key) || [] // 新
    const prveChecked = initMembers?.map((v) => v.id) || [] // 已选
    let _checkedChildren: any = []
    if (!Array.isArray(checkedChildren)) {
      Object.keys(checkedChildren).forEach((el) => {
        let ids = checkedChildren[el]
        _checkedChildren = _checkedChildren.concat(ids)
      }) // 内部变价 记录的 子节点虚拟选中 key : object
    }
    _checkedChildren = _checkedChildren?.map((v) => v.key)
    return [...newChecked, ...prveChecked, ..._checkedChildren]
  }, [checkedOrgs, initMembers, checkedChildren, searchPamas])

  const changeTreeData = () => {
    //更新已选的 保留已有的
    // 更新选中
    Object.keys(checkedChildren).forEach((el) => {
      if (!initMembers?.find((v) => v.id === el) && !checkedOrgs?.find((v) => v.key === el)) {
        delete checkedChildren[el]
        // 更新 tree 可 checked
        editTreeNodeFields({
          treeData,
          el: { key: el },
          editField: { key: 'disableCheckbox', value: false },
          nodeId: 'key'
        })
      }
    })
    setTreeData([...(treeData || [])])
    setCheckedChildren({ ...checkedChildren })
  }

  useEffect(() => {
    // 外部更新部门  tree更新
    changeTreeData()
  }, [checkedOrgs])

  // 是否包含字节点切换
  const onChangeConatinSubOrg = (node: any) => {}

  const titleRender = (nodeData: any) => {
    const isShow = nodeData.key === selectedOrg?.key
    return (
      <div className="org-tree-title">
        <span>{nodeData.title}</span>
        <Tooltip title="默认包含子机构，可点击切换">
          <span className={isShow ? 'icon icon-show' : 'icon'}>
            <ApartmentOutlined
              onClick={(e) => {
                e.stopPropagation()
                onChangeConatinSubOrg(nodeData)
              }}
            />
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
      checkStrictly={checkStrictly}
      onCheck={(_, rows: any) => {
        checkStrictly ? checkStrictlyCheckedChange(rows) : treeCheckedChange(rows)
      }}
      checkable={isCheck}
    />
  )
}

export default OrgTree
