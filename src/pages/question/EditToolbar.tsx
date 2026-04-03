import { Space, Tooltip, Button } from 'antd'
import {
  BlockOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  UpOutlined,
  DownOutlined,
  UndoOutlined,
  RedoOutlined
} from '@ant-design/icons'
import React from 'react'
import { useDispatch } from 'react-redux'
import {
  deleteComponent,
  hiddenComponent,
  toogleLock,
  copyComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
  reorderComponents
} from '../../store/componentsReducer/index'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'
import { useKeyPress } from 'ahooks'
import { arrayMove } from '@dnd-kit/sortable'

export default function EditToolbar() {
  const dispatch = useDispatch()
  const { selectedId, selectedComponent, copiedComponent, componentsList } = useGetComponentInfo()
  const { isLock } = selectedComponent
  const componentLength = componentsList.length
  const nowSelectedIndex = componentsList.findIndex(c => c._id === selectedId)
  const isFarst = nowSelectedIndex === 0
  const isLast = nowSelectedIndex === componentLength - 1

  function deleteTopic() {
    dispatch(deleteComponent())
  }
  function hiddenTopic() {
    dispatch(hiddenComponent({ _id: selectedId, isHidden: true }))
  }
  function lockTopic() {
    dispatch(toogleLock({ _id: selectedId }))
  }

  function copyTopic() {
    dispatch(copyComponent({ _id: selectedId }))
  }

  function pasetTopic() {
    dispatch(pasteComponent())
  }

  function moveUp() {
    const newComponentList = arrayMove(componentsList, nowSelectedIndex, nowSelectedIndex - 1)
    dispatch(reorderComponents(newComponentList))
  }

  function moveDown() {
    const newComponentList = arrayMove(componentsList, nowSelectedIndex, nowSelectedIndex + 1)
    dispatch(reorderComponents(newComponentList))
  }

  function undo() {
    dispatch({
      type: 'ComponentUndo'
    })
  }

  function redo() {
    dispatch({
      type: 'ComponentRedo'
    })
  }
  function useBindCanvansKeyPress() {
    useKeyPress(['delete', 'backspace'], () => {
      const activeElement = document.activeElement
      if (activeElement === document.body) {
        deleteTopic()
      }
    })
    useKeyPress(['ctrl.c', 'meta.c'], () => {
      const activeElement = document.activeElement
      if (activeElement === document.body) {
        copyTopic()
      }
    })
    useKeyPress(['ctrl.v', 'meta.v'], () => {
      const activeElement = document.activeElement
      if (activeElement === document.body && copiedComponent) {
        pasetTopic()
      }
    })
    useKeyPress(['uparrow'], () => {
      dispatch(selectPrevComponent())
    })
    useKeyPress(['downarrow'], () => {
      dispatch(selectNextComponent())
    })
    useKeyPress(['ctrl.z', 'meta.z'], () => {
      undo()
    })
    useKeyPress(['ctrl.y', 'meta.y'], () => {
      redo()
    })
  }

  useBindCanvansKeyPress()

  return (
    <Space>
      <Tooltip title="删除">
        <Button shape="circle" icon={<DeleteOutlined />} onClick={deleteTopic} />
      </Tooltip>

      <Tooltip title="隐藏">
        <Button shape="circle" icon={<EyeInvisibleOutlined />} onClick={hiddenTopic} />
      </Tooltip>

      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          type={isLock ? 'primary' : 'default'}
          onClick={lockTopic}
        />
      </Tooltip>

      <Tooltip title="复制">
        <Button shape="circle" icon={<CopyOutlined />} onClick={copyTopic} />
      </Tooltip>

      <Tooltip title="粘贴">
        <Button
          disabled={!copiedComponent}
          shape="circle"
          icon={<BlockOutlined />}
          onClick={pasetTopic}
        />
      </Tooltip>

      <Tooltip title="上移">
        <Button disabled={isFarst} shape="circle" icon={<UpOutlined />} onClick={moveUp} />
      </Tooltip>

      <Tooltip title="下移">
        <Button disabled={isLast} shape="circle" icon={<DownOutlined />} onClick={moveDown} />
      </Tooltip>

      <Tooltip title="撤回">
        <Button shape="circle" icon={<UndoOutlined />} onClick={undo} />
      </Tooltip>

      <Tooltip title="重做">
        <Button shape="circle" icon={<RedoOutlined />} onClick={redo} />
      </Tooltip>
    </Space>
  )
}
