import React from 'react'
import {
  componentsGroup,
  ComponentConfType
} from '../../components/QuestionComponents'
import { Typography } from 'antd'
import style from './ComponentLib.module.scss'
import { useDispatch } from 'react-redux'
import { addComponent } from '../../store/componentsReducer'
import { nanoid } from 'nanoid'

const { Title } = Typography

export default function ComponentLib() {
  const dispatch = useDispatch()
  function handleClickComponent(comItem: ComponentConfType) {
    dispatch(
      addComponent({
        _id: nanoid(),
        name: comItem.type + '_' + nanoid(8),
        title: comItem.title,
        type: comItem.type,
        props: comItem.defaultProps
      })
    )
  }
  function genComponent(comItem: ComponentConfType) {
    const { Component } = comItem
    return (
      <div
        key={comItem.type}
        className={style.wrapper}
        onClick={() => handleClickComponent(comItem)}
      >
        <div className={style.component}>
          <Component />
        </div>
      </div>
    )
  }

  return (
    <div>
      {componentsGroup.map((gropu, index) => {
        return (
          <div key={index}>
<Title
              level={5}
              style={{
                margin: '0',
                marginBottom: 10,
                marginTop: index > 0 ? 15 : 0
              }}
            >
              {gropu.groupName}
            </Title>
{gropu.components.map(component => genComponent(component))}
          </div>
        )
      })}
    </div>
  )
}
