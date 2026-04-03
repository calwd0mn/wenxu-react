import React, { useEffect, useState } from 'react'
import style from './question.module.scss'
import { Flex, Input, Space } from 'antd'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { LIST_SEARCH_PARMA_KEY, PAGE_NUMBER_KEY } from '../constant'

const { Search } = Input

type propsType = {
  title: string
}

export default function QuestionHeader(props: propsType) {
  const { title } = props
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [searchParam] = useSearchParams()

  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  const handleSearch = (value: string) => {
    searchParam.set(LIST_SEARCH_PARMA_KEY, value)
    searchParam.set(PAGE_NUMBER_KEY, '1')

    nav({
      pathname,
      search: searchParam.toString()
    })
  }

  useEffect(() => {
    const search = searchParam.get(LIST_SEARCH_PARMA_KEY)
    setValue(search || '')
  }, [searchParam])

  return (
    <>
      <Flex justify="space-between" align="center" className={style.header}>
        <div className={style.questionHeaderTitle}>{title}</div>
        <Space>
          <Search
            placeholder="请输入问卷名称"
            allowClear
            value={value}
            onChange={handleChange}
            onSearch={handleSearch}
          />
        </Space>
      </Flex>
    </>
  )
}
