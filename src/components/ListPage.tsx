import React, { useState, useEffect } from 'react'
import { Flex, Pagination } from 'antd'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { PAGE_NUMBER_KEY, PAGE_SIZE_KEY } from '../constant'

type ListPageProps = {
  total: number
}
export default function ListPage(props: ListPageProps) {
  const nav = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [pageNum, setPageNum] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const { total } = props

  useEffect(() => {
    setPageNum(parseInt(searchParams.get(PAGE_NUMBER_KEY) || '1'))
    setPageSize(parseInt(searchParams.get(PAGE_SIZE_KEY) || '10'))
  }, [searchParams])

  function handlePageChange(page: number, pageSize: number) {
    searchParams.set(PAGE_NUMBER_KEY, page.toString() || '1')
    searchParams.set(PAGE_SIZE_KEY, pageSize.toString() || '10')
    nav({
      pathname: location.pathname,
      search: searchParams.toString()
    })
  }

  return (
    <div>
      <Flex justify="center">
        <Pagination
          total={total}
          showTotal={total => `共 ${total} 条`}
          showSizeChanger
          showLessItems
          current={pageNum}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </Flex>
    </div>
  )
}
