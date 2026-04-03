import React, { useRef } from 'react'

export default function UseRefDemo() {
  const inputRef = useRef<HTMLInputElement>(null)

  function setBlur() {
    const current = inputRef.current
    if (current) {
      current.focus()
      current.style.color = 'red'
    }
  }

  return (
    <>
      <input type="text" ref={inputRef} defaultValue="hello word" />
      <button onClick={setBlur}>获取焦点</button>
    </>
  )
}
