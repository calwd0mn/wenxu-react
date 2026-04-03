import React from 'react'
import { QuestionTitleDefaultProps, QuestionTitlePropsType } from './interface'
import Title from 'antd/es/typography/Title'

export default function QuestionTitle(props: QuestionTitlePropsType) {
  const { text, isCenter, color, level } = { ...QuestionTitleDefaultProps, ...props }

  function getFontSize(level: number | undefined) {
    switch (level) {
      case 1:
        return '24px'
      case 2:
        return '20px'
      case 3:
        return '16px'
      case 4:
        return '14px'
      case 5:
        return '12px'
      default:
        return '14px'
    }
  }

  return (
    <Title
      style={{
        margin: 0,
        textAlign: isCenter ? 'center' : 'left',
        fontSize: getFontSize(level),
        color
      }}
    >
      {text}
    </Title>
  )
}
