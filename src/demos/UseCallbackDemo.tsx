import React, { useState, useCallback } from 'react'
import { useMousePosition, useGetInfo } from './HookUtils'
import { useLockFn } from 'ahooks'

export default function UseCallbackDemo() {
  const [text, setText] = useState('hello')
  const { x, y } = useMousePosition()
  const { loading, userInfo } = useGetInfo()
  const [count, setCount] = useState(0)

  function fn1() {
    console.log('fn1', text)
  }

  const fn2 = useCallback((): void => {
    console.log('fn2', text)
  }, [text])

  function timeOutCount() {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }

  //   async function submit() {
  //     await timeOutCount()
  //     setCount(count + 1)
  //   }

  const submit = useLockFn(async () => {
    await timeOutCount()
    setCount(count + 1)
  })

  return (
    <div>
      <h1>UseCallbackDemo</h1>
      <button onClick={fn1}>fn1</button>
      <button onClick={fn2}>fn2</button>
      <input value={text} onChange={e => setText(e.target?.value)} />
      <div>
        鼠标位置：{x} {y}
      </div>
      <div>{loading ? '加载中...' : userInfo}</div>
      <div>
        count: {count}
        <button onClick={submit}>submit</button>
      </div>
    </div>
  )
}
