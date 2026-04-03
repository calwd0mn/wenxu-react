import { useRequest } from 'ahooks'
import { getQuestionListFun } from '../api/list'
import { useSearchParams } from 'react-router-dom'
import { LIST_SEARCH_PARMA_KEY, PAGE_NUMBER_KEY, PAGE_SIZE_KEY } from '../constant'

type QuestionSearchProp = {
  isDelete: number
  isStar: boolean
}
export function useLoadQuestionListData(
  params: Partial<QuestionSearchProp> = {
    isDelete: 0
  }
) {
  const [searchParam] = useSearchParams()

  const { data, loading, refresh } = useRequest(
    async () => {
      const data = await getQuestionListFun({
        title: searchParam.get(LIST_SEARCH_PARMA_KEY) || '',
        ...params,
        pageNum: parseInt(searchParam.get(PAGE_NUMBER_KEY) || '1'),
        pageSize: parseInt(searchParam.get(PAGE_SIZE_KEY) || '10')
      })
      return data
    },
    {
      refreshDeps: [searchParam]
    }
  )
  return {
    data,
    loading,
    refresh
  }
}
