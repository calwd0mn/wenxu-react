import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { componentInfoType } from '../store/componentsReducer'

function useGetComponentInfo() {
  const components = useSelector((state: RootState) => state.components.present)

  const { componentsList = [], selectedId, copiedComponent } = components

  const getSelectedComponent = () => {
    if (!selectedId) {
      return {}
    }
    return componentsList.find(c => c._id === selectedId) || {}
  }

  return {
    componentsList,
    selectedId,
    copiedComponent,
    selectedComponent: getSelectedComponent() as componentInfoType
  }
}

export default useGetComponentInfo
