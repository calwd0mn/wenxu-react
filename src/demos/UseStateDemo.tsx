import React, { FC } from 'react'
import { produce } from 'immer'

const UseStateDemo: FC = () => {
  const [arr, setArr] = React.useState<number[]>([1, 2])
  const [useInfo, setUseInfo] = React.useState({ name: '张三', age: 18 })

  function addItem() {
    setArr(
      produce(draft => {
        draft.push(3)
      })
    )
  }

  function changeUserAge() {
    setUseInfo(
      produce(draft => {
        draft.age = 20
      })
    )
  }

  return (
    <div>
      <h1>useState Demo</h1>
      <div>{JSON.stringify(arr)}</div>
      <button onClick={addItem}>新增</button>

      <div>{JSON.stringify(useInfo)}</div>
      <button onClick={changeUserAge}>修改</button>
    </div>
  )
}

export default UseStateDemo
