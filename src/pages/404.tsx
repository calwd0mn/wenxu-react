import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const App: React.FC = () => {
  const nav = useNavigate()

  const goHome = () => {
    nav('/')
  }

  return (
    <div
      style={{
        minHeight: `var(--content-height)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={goHome}>
            回到首页
          </Button>
        }
      />
    </div>
  )
}

export default App
