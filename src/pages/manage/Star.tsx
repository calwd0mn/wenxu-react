import React, { FC, useEffect, useState } from 'react'
import QuestionCar from '../../components/QuestionCar'
import QuestionHeader from '../../components/QuestionHeader'
import { Empty, Flex, Spin, message } from 'antd'
import { QuestionType } from '../../types/QuestionType'
import { useLoadQuestionListData } from '../../hooks/useLoadQuestionListData'
import ListPage from '../../components/ListPage'
import { useRequest } from 'ahooks'
import { deleteQuestionFun, updateQuestionInfoFun } from '../../api/list'
import { produce } from 'immer'

const List: FC = () => {
  const [questionData, setQuestionData] = useState<QuestionType[]>([])
  const [total, setTotal] = useState<number>(0)

  const { data, loading, refresh } = useLoadQuestionListData({ isStar: true })

  useEffect(() => {
    if (data) {
      setQuestionData(data.data.list)
      setTotal(data.data.total)
    }
  }, [data])
  const { run: updateData, loading: updateLoading } = useRequest(
    async data => {
      return await updateQuestionInfoFun(data)
    },
    {
      manual: true,
      onSuccess: res => {
        message.success(res.message)
        setQuestionData(
          produce(draft => {
            const find = draft.find(item => item._id === res.data._id)
            if (find) {
              find.star = res.data.star
            }
          })
        )
        refresh()
      }
    }
  )

  function starQuestion(_id: string, star: boolean) {
    updateData({
      _id,
      star
    })
  }
  const { run: deleteOne, loading: deleteLoading } = useRequest(
    async _id => await deleteQuestionFun(_id),
    {
      manual: true,
      onSuccess(res) {
        refresh()
        message.success(res.message)
      }
    }
  )

  function removeQuestion(_id: string) {
    deleteOne(_id)
  }

  return (
    <>
      <QuestionHeader title="标星问卷" />
      {loading && (
        <Flex justify="center" align="center" style={{ height: '100%' }}>
          <Spin size="large" />
        </Flex>
      )}
      {questionData.length === 0 && (
        <Flex justify="center" style={{ marginBottom: '15px' }}>
          <Empty />
        </Flex>
      )}
      {!loading && (
        <div>
          {questionData.map(question => {
            const _id = question._id
            return (
              <QuestionCar
                key={_id}
                _id={_id}
                title={question.title}
                publish={question.publish}
                createTime={question.createTime}
                star={question.star}
                updateLoading={updateLoading}
                deleteLoading={deleteLoading}
                removeQuestion={removeQuestion}
                starQuestion={starQuestion}
              />
            )
          })}
          <ListPage total={total} />
        </div>
      )}
    </>
  )
}

export default List
