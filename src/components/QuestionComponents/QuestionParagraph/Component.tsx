import React from 'react'
import { QuestionParagraphDefaultProps, QuestionParagraphPropsType } from './interface'

export default function QuestionParagraph(props: QuestionParagraphPropsType) {
  const { text = '', isCenter, strong } = { ...QuestionParagraphDefaultProps, ...props }

  const textList = text.split('\n')

  return (
    <div
      style={{
        textAlign: isCenter ? 'center' : undefined,
        color: props.color,
        fontWeight: strong ? 'bold' : undefined
      }}
    >
      {textList.map((item, index) => {
        return (
          <span key={index}>
            {item}
            <br />
          </span>
        )
      })}
    </div>
  )
}
