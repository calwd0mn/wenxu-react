import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import userInfoReducer from './userInfoSlice'
import componentReducer from './componentsReducer'
import pageInfoReducer from './pageInfoReducer'
import undoable, { excludeAction } from 'redux-undo'

const store = configureStore({
  reducer: {
    counter: counterReducer,
    userInfo: userInfoReducer,
    pageInfo: pageInfoReducer,
    components: undoable(componentReducer, {
      limit: 20,
      filter: excludeAction([
        'components/changeSelectedId',
        'components/selectPrevComponent',
        'components/selectNextComponent',
        'components/resertComponents'
      ]),
      undoType: 'ComponentUndo',
      redoType: 'ComponentRedo'
    })
  }
})

type GetStateFunType = typeof store.getState

export type RootState = ReturnType<GetStateFunType>

export default store
