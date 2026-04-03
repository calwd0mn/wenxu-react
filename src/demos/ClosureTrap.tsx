import React, { useState, useRef, useEffect } from 'react'

export default function ClosureTrap() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  useEffect(() => {
    countRef.current = count
  }, [count])

  function addCount() {
    setCount(count + 1)
  }

  function alertCount() {
    setTimeout(() => {
      alert(countRef.current)
    }, 3000)
  }

  return (
    <>
      <div>{count}</div>
      <button onClick={addCount}>add</button>
      <button onClick={alertCount}>alert</button>
    </>
  )
}
