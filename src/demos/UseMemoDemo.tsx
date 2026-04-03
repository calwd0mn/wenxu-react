import React, { useEffect, useMemo, useState } from 'react'

export default function UseMemoDemo() {
  useEffect(() => {
    console.log('create')
  }, [])

  const [num1, setNum1] = useState(1)
  const [num2, setNum2] = useState(2)
  const [count, setCount] = useState(12)

  const sum = useMemo(() => {
    return num1 + num2
  }, [num1, num2])

  return (
    <>
      <div>sum：{sum}</div>
      <div>
        num1: {num1}
        <button onClick={() => setNum1(num1 + 1)}>添加</button>
      </div>

      <div>
        num2: {num2}
        <button onClick={() => setNum2(num2 + 1)}>添加</button>
      </div>

      <div>
        <input type="number" value={count} onChange={e => setCount(Number(e.target?.value))} />
      </div>
    </>
  )
}
