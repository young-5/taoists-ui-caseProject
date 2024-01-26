import { ApartmentOutlined, CompressOutlined } from '@ant-design/icons'
import { Tooltip, Tree } from 'antd'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { SelectedMemberContext } from '../../context'
import { Org } from '../../type'
import './index.less'
import { deepClone, editTreeNode, editTreeNodeFields, findNode } from './treeHandle'

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
  useEffect(() => {
    initFetch()
  }, [])
  useEffect(() => {
    // 外部更新部门  tree更新
    changeTreeData()
  }, [checkedOrgs])

  const getOrgs = async (id?: string) => {
    const data = await fetchOrgs(id)
    return data || []
  }
  // 初始化数据获取
  const initFetch = async () => {
    await getOrgs().then((res: any) => {
      let initTreeData = res.map((v) => {
        if (initMembers?.find((m) => v.key === m.id)) {
          // 已选不可选
          return { ...v, disableCheckbox: true }
        }
        return v
      })
      setTreeData(initTreeData)
    })
  }

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
    // 需要判断是否关联子节点
    const { checked, node } = rows
    const currentNode = {
      //点击的node节点  数据提取
      title: node.title,
      checked: node.checked,
      key: node.key,
      pid: node.pid || '',
      isNoContainSub: node.isNoContainSub
    }
    let newTreeData = deepClone(treeData)
    let newChildrenChecked = checkedChildren || {}
    let newCheckedOrg: any[] = checkedOrgs || []
    if (checked) {
      // 选中 （如果子节点选中 再选父节点 ，只保留父节点）  剔除 子节点选中
      let _currentNode = findNode(currentNode, newTreeData)
      newCheckedOrg = newCheckedOrg?.filter((org) => {
        if (findNode(org, _currentNode?.children || [])) {
          return false
        }
        return true
      })
      newCheckedOrg?.push(currentNode)
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
    // 更新已选的 保留已有的
    // 更新选中
    Object.keys(checkedChildren).forEach((el) => {
      //  不在已选新选的 孙中
      const isChildren = (node) => {
        let nodeTree = findNode(node, treeData)
        return findNode({ key: el }, nodeTree?.children || [])
      }
      // 不在已选 不在新选 子 孙 中
      if (
        !initMembers?.find((v) => v.id === el || isChildren({ ...v, key: v.id })) &&
        !checkedOrgs?.find((v) => v.key === el || isChildren(v))
      ) {
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
    // 更新 父子关联相关属性
    checkedOrgs?.forEach((el) => {
      let node = findNode(el, treeData)
      if (el.isNoContainSub !== node.isNoContainSub) {
        //更新
        if (!el.isNoContainSub) {
          node.isNoContainSub = el.isNoContainSub
        }
        //更新 子孙数据
        onChangeConatinSubOrg(el, el.isNoContainSub)

        if (el.isNoContainSub) {
          node.isNoContainSub = el.isNoContainSub
        }
      }
    })

    // setTreeData([...(treeData || [])])
    // setCheckedChildren({ ...checkedChildren })
  }

  // 是否包含字节点切换
  const onChangeConatinSubOrg = (node: any, isNoContainSub) => {
    // 不包含直接点
    // 修改节点 的 isNoContainSub 及其子节点   disableCheckbox
    // 删除 子节点的选中
    // 修改新选中的 机构 icon显示
    let el = findNode(node, treeData)
    if (!isNoContainSub) {
      el.isNoContainSub = isNoContainSub
    }

    const newCheckedOrg: any = checkedOrgs?.map((v) => {
      if (v.key === node.key) {
        return { ...v, isNoContainSub }
      }
      return v
    })
    let newChildrenChecked: any = checkedChildren || {}
    //节点 是否选中
    // let isParentChecked = checkedChildren[node.id] || checkedChildren[node.pid] // 或者节点是否是被选中节点的子孙节点
    if (checkedOrgs?.find((org) => org.key === node.key)) {
      //取消 子孙级的选中 和 禁用状态
      editTreeNode({
        node: el,
        treeData: treeData,
        editField: { key: 'disableCheckbox', value: isNoContainSub ? false : true },
        childrenChecked: newChildrenChecked,
        isDel: isNoContainSub ? true : false,
        isAllEdit: true
      })
    }
    if (isNoContainSub) {
      el.isNoContainSub = isNoContainSub
    }
    // 更新tree
    setTreeData([...(treeData || [])])
    // 更新虚拟选中
    setCheckedChildren({ ...newChildrenChecked })
    // 更新 选择的组织
    selectedMemberContext.checkedOrgsChange?.(newCheckedOrg)
  }

  const titleRender = (nodeData: any) => {
    const isShow = nodeData.key === selectedOrg?.key
    let isEdit = // 已选 新选包含 子孙节点
      !initMembers?.find((v) => v.id === nodeData.key) &&
      !checkedChildren[nodeData.id] &&
      !checkedChildren[nodeData.pid]
    return (
      <div className="org-tree-title">
        <span>{nodeData.title}</span>
        {isEdit && (
          <Tooltip title="默认包含子机构，可点击切换">
            <span className={isShow ? 'icon icon-show' : 'icon'}>
              {nodeData.isNoContainSub ? (
                <CompressOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    onChangeConatinSubOrg(nodeData, false)
                  }}
                />
              ) : (
                // 包含
                <ApartmentOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    onChangeConatinSubOrg(nodeData, true)
                  }}
                />
              )}
            </span>
          </Tooltip>
        )}
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
