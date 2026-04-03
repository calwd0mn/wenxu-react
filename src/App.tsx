import React from 'react'
import { RouterProvider } from 'react-router-dom'
import routerConfig from './roters'
import { useTitle } from 'ahooks'

function App() {
  useTitle('问序')
  return <RouterProvider router={routerConfig} />
}

export default App
