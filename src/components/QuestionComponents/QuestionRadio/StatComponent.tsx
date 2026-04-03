import React, { FC } from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { QuestionRadioStatType } from './interface'

const StatComponent: FC<QuestionRadioStatType> = props => {
  const { stat } = props

  return (
    <ResponsiveContainer width="100%" height="50%">
      <BarChart
        data={stat}
        margin={{
          top: 40,
          right: 30,
          left: 20,
          bottom: 20
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="value" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" activeBar={<Rectangle />} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default StatComponent
