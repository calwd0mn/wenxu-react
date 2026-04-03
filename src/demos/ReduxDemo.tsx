import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount } from '../store/counterSlice'
import { RootState } from '../store'
import { Button } from 'antd'
export default function ReduxDemo() {
  const count = useSelector((state: RootState) => state.counter.present.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>{count}</div>
      <Button onClick={() => dispatch(increment())}>+</Button>
      <Button onClick={() => dispatch(decrement())}>-</Button>
      <Button onClick={() => dispatch(incrementByAmount(10))}>加10</Button>
    </div>
  )
}
