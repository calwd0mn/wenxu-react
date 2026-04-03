import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import ManageLayout from '../layouts/ManageLayout'
import QuestionLayout from '../layouts/QuestionLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import List from '../pages/manage/List'
import Star from '../pages/manage/Star'
import Trash from '../pages/manage/Trash'
import NotFound from '../pages/404'

// import Edit from '../pages/question/Edit'
// import Stat from '../pages/question/Stat'
const Edit = lazy(() => import(/* webpackChunkName: "question-edit" */ '../pages/question/Edit'));
const Stat = lazy(() => import(/* webpackChunkName: "question-stat" */'../pages/question/Stat'));
const ReduxDemo = lazy(() => import('../demos/ReactMomeDemo'))

const Router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'manage',
        element: <ManageLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="list" replace />
          },
          {
            path: 'list',
            element: <List />
          },
          {
            path: 'star',
            element: <Star />
          },
          {
            path: 'trash',
            element: <Trash />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  },
  {
    path: '/question',
    element: <QuestionLayout />,
    children: [
      {
        path: 'add',
        element: <Edit />
      },
      {
        path: 'edit/:id',
        element: <Edit />
      },
      {
        path: 'stat/:id',
        element: <Stat />
      }
    ]
  },
  {
    path: '/demo',
    children: [
      {
        path: 'ReduxDemo',
        element: (
          <Suspense>
            <ReduxDemo />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export const HOME_PATH = '/'
export const LOGIN_PATH = '/login'
export const REGISTER_PATH = '/register'
export const LIST_PATH = '/manage/list'
export const STAR_PATH = '/manage/star'
export const TRASH_PATH = '/manage/trash'

export default Router
