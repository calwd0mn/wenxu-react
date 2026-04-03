import { useSelector } from 'react-redux'
import { RootState } from '../store'
/**
 *
 *
 */
const useGetPageInfo = () => {
  const pageInfo = useSelector((state: RootState) => state.pageInfo)
  return pageInfo
}

export default useGetPageInfo
