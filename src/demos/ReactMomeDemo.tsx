import React, { useState, memo } from 'react'
const ChildComponent = memo(({ text }: { text: string }) => {
  console.log('Child re-rendered') // Uncomment for debugging
  return <div>{text}</div>
})

ChildComponent.displayName = 'ChildComponent'

function ParentComponent() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Parent Component</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <ChildComponent text="Hello" />
    </div>
  )
}

export default ParentComponent
