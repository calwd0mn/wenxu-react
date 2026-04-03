import React, { useState } from 'react'
import style from './Edit.module.scss'
import EditCanvas from './EditCanvas'
import { useLoadQuestionData } from '../../hooks/useLoadQuestionData'
import { useDispatch } from 'react-redux'
import { changeSelectedId } from '../../store/componentsReducer'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import EditHeader from './EditHeader'
import AiAssistantModal, { AiAssistantMode } from './ai/AiAssistantModal'

export default function Edit() {
  const { loading } = useLoadQuestionData()
  const disptach = useDispatch()
  const [aiMode, setAiMode] = useState<AiAssistantMode | null>(null)
  function clickContent() {
    disptach(changeSelectedId(''))
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.header}>
          <EditHeader onOpenAi={() => setAiMode('page')} />
        </div>
        <div className={style.content}>
          <div className={style.left}>
<LeftPanel />
          </div>
          <div className={style.center} onClick={clickContent}>
            <div className={style.canvas}>
<EditCanvas loading={loading} />
            </div>
          </div>
          <div className={style.right}>
<RightPanel onOpenAiOptimize={() => setAiMode('component')} />
          </div>
        </div>
      </div>
      <AiAssistantModal
        open={aiMode !== null}
        mode={aiMode || 'page'}
        onClose={() => setAiMode(null)}
      />
    </>
  )
}
