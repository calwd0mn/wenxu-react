import { Empty } from 'antd'
import React from 'react'
import QuestionForm from './QuestionForm'
import { createServerApiUrl } from '@/lib/server-api'

type Props = {
  params: { id: string }
}

export default async function Page(props: Props) {
  const { id } = props.params
  const data = await fetch(createServerApiUrl(`/question/getInfo?_id=${id}`), {
    cache: 'no-store'
  }).then(response => response.json())

  const { isDelete, publish, componentsList } = data.data

  if (isDelete !== 0) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <Empty description="问卷已删除" />
      </div>
    )
  }

  if (!publish) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        <Empty description="问卷未发布" />
      </div>
    )
  }

  return <QuestionForm componentsList={componentsList} questionId={id} />
}
