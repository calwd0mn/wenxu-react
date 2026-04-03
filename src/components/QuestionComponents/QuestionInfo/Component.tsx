import React from 'react'
import { QuestionInfoDefaultProps, QuestionInfoPropsType } from './interface'
import { Typography } from 'antd'
const { Title } = Typography

export default function QuestionTitle(props: QuestionInfoPropsType) {
  const {
    title,
    titleColor,
    titleIsCenter,
    titleLevel,
    text,
    textColor,
    textIsCenter,
    textStrong,
    textMarginTop
  } = { ...QuestionInfoDefaultProps, ...props }

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
    <div>
      <Title
        style={{
          margin: 0,
          textAlign: titleIsCenter ? 'center' : 'left',
          fontSize: getFontSize(titleLevel),
          color: titleColor
        }}
      >
        {title}
      </Title>
      <div
        style={{
          textAlign: textIsCenter ? 'center' : 'left',
          color: textColor,
          fontWeight: textStrong ? 'bold' : 'normal',
          marginTop: textMarginTop
        }}
      >
        {text}
      </div>
    </div>
  )
}
