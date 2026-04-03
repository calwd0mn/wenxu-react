import React from 'react'
import { Button } from 'antd'
import style from '../styles/Home.module.scss'
import { useNavigate } from 'react-router-dom'
import { LIST_PATH } from '../roters'
import { useRequest } from 'ahooks'
import { getQuestionStatisticsFun } from '../api/list'
import { BRAND_NAME, BRAND_SUBTITLE, BRAND_TAGLINE } from '../constant/brand'
export default function Home() {
  const nav = useNavigate()
  const { data } = useRequest(getQuestionStatisticsFun)
  const goHome = () => {
    nav(LIST_PATH)
  }

  return (
    <div className={style.content}>
      <div className={style.hero}>
        <div className={style.badge}>{BRAND_SUBTITLE}</div>
        <h1>{BRAND_NAME}</h1>
        <p className={style.tagline}>{BRAND_TAGLINE}</p>
        <p className={style.description}>
          从灵感草稿、AI 对话生成，到发布、回收与分析，把问卷制作整理成一条更顺滑的工作流。
        </p>
        <div className={style.stats}>
          <div className={style.statCard}>
            <strong>{data?.data.questionTotal || 0}</strong>
            <span>累计问卷</span>
          </div>
          <div className={style.statCard}>
            <strong>{data?.data.published || 0}</strong>
            <span>已发布</span>
          </div>
          <div className={style.statCard}>
            <strong>{data?.data.answered || 0}</strong>
            <span>已回收答卷</span>
          </div>
        </div>
        <div className={style.actions}>
          <Button size="large" type="primary" onClick={goHome}>
            进入工作台
          </Button>
        </div>
      </div>
    </div>
  )
}
