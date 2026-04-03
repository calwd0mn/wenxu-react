import React, { FC, useState, useEffect, useRef } from 'react'
import QuestionCar from '../../components/QuestionCar'
import QuestionHeader from '../../components/QuestionHeader'
import { produce } from 'immer'
import { QuestionType } from '../../types/QuestionType'
import { Flex, message, Spin } from 'antd'
import { LIST_SEARCH_PARMA_KEY } from '../../constant'
import { useSearchParams } from 'react-router-dom'
import { deleteQuestionFun, getQuestionListFun, updateQuestionInfoFun } from '../../api/list'
import { useRequest } from 'ahooks'

const List: FC = () => {
  const [loading, setLoading] = useState(false)
  const [questionData, setQuestionData] = useState<QuestionType[]>([])
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()
  const [total, setTotal] = useState(0)
  const keyWord = searchParams.get(LIST_SEARCH_PARMA_KEY) || ''

  const [pages, setPages] = useState({
    pageNum: 1,
    pageSize: 10,
    title: keyWord
  })

  function getListData() {
    setLoading(true)
    getQuestionListFun(pages)
      .then(res => {
        setQuestionData(
          produce(draft => {
            draft.push(...res.data.list)
          })
        )
        setTotal(res.data.total)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const searchTitle = searchParams.get(LIST_SEARCH_PARMA_KEY) || ''
    setQuestionData([])
    setPages(
      produce(draft => {
        draft.title = searchTitle
        draft.pageNum = 1
      })
    )
    setTotal(0)
  }, [keyWord])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && questionData.length < total && !loading) {
          console.log('触发加载更多')
          setPages(
            produce(draft => {
              draft.pageNum += 1
            })
          )
        }
      })
    })
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [questionData, total, loading])
  useEffect(() => {
    getListData()
  }, [pages])
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
        setQuestionData([])
        getListData()
        message.success(res.message)
      }
    }
  )

  function removeQuestion(_id: string) {
    deleteOne(_id)
  }

  return (
    <>
      <QuestionHeader title="我的问卷" />
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
        {loading && (
          <Flex justify="center" align="center">
            <Spin />
          </Flex>
        )}
        <div ref={loadMoreRef} style={{ textAlign: 'center', marginTop: '15px' }}>
          <div>
            共 {total} 个问卷，已显示 {questionData.length} 个
          </div>
          <div>{questionData.length === total ? '已显示全部' : '上滑加载更多...'}</div>
        </div>
      </div>
    </>
  )
}

export default List
