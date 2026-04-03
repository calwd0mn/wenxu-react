import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import '@ant-design/v5-patch-for-react-19'
import zh_CN from 'antd/es/locale/zh_CN'
import ConfigProvider from 'antd/es/config-provider'
import store from './store/index'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>

  <ConfigProvider locale={zh_CN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
