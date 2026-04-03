import React, { FC } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { QuestionRadioStatType } from '../QuestionRadio'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const StatPieChart: FC<QuestionRadioStatType> = props => {
  const { stat } = props
  function getPercent(itemCoiunt: number) {
    return (itemCoiunt / stat.reduce((acc, cur) => acc + cur.count, 0)) * 100
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={stat}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          label={entry => `${entry['aria-label']} (${getPercent(entry.count).toFixed(2)}%})`}
        >
          {stat.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} aria-label={entry.value}>
              <Tooltip />
            </Cell>
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export default StatPieChart
