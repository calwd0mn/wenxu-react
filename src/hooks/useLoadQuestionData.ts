import { useRequest } from 'ahooks'
import { getQuestionInfoFun } from '../api/list'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { resertComponents } from '../store/componentsReducer'
import { pageInfoDefaultProps, resertPageInfo } from '../store/pageInfoReducer'
export function useLoadQuestionData() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { run, loading, error } = useRequest(id => getQuestionInfoFun(id as string), {
    manual: true,
    onSuccess(res) {
      const { componentsList, title, description, jsCode, cssCode, publish, star } = res.data
      let selectedId = ''
      if (componentsList.length > 0) {
        selectedId = componentsList[0]._id
      }
      dispatch(resertComponents({ componentsList, selectedId }))
      dispatch(resertPageInfo({ title, description, jsCode, cssCode, publish, star }))
    }
  })

  useEffect(() => {
    if (id) {
      run(id)
    } else {
      dispatch(resertComponents({ componentsList: [], selectedId: '' }))
      dispatch(resertPageInfo(pageInfoDefaultProps))
    }
  }, [id])

  return {
    loading,
    error
  }
}
