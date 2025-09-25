// components/Charts/ResponsiveRadialBar.jsx
import React from 'react';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  Cell,
} from 'recharts';

const ResponsiveRadialBar = ({
  data,
  innerRadius = '10%',
  outerRadius = '90%',
  width = '100%',
  height = 500,
  colors = ['#ff6b6b', '#6bcBFF', '#7dffc0', '#ffd56b'],
  legendPosition = { right: 20 },
  showLegend = true,
  showTooltip = true,
  startAngle = 90,
  endAngle = -270,
  dataKey = 'value',
  nameKey = 'name',
  ...rest
}) => (
  <ResponsiveContainer width={width} height={height}>
    <RadialBarChart
      data={data}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      {...rest}
    >
      <RadialBar
        label={{ position: 'insideStart', fill: '#fff' }}
        background
        dataKey={dataKey}
        isAnimationActive={false}
        fillOpacity={1}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
          />
        ))}
      </RadialBar>

      {showLegend && <Legend wrapperStyle={legendPosition} />}
      {showTooltip && <Tooltip />}
    </RadialBarChart>
  </ResponsiveContainer>
);

export default ResponsiveRadialBar;
