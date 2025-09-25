import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Typography } from "@mui/material"; // Make sure you have MUI Typography

interface PieArcLabelChartProps {
  data: { name: string; value: number }[];
  width?: number;
  height?: number;
  title?: string; // Added title prop
}

export default function PieArcLabelChart({
  data,
  width = 200,
  height = 200,
  title, // Destructure title from props
}: PieArcLabelChartProps) {
  // Predefined colors for the pie chart slices
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#34d399"];

  return (
    <div>
      {title && (
        <Typography variant="h6" mb={2} display={"flex"} justifyContent={"center"}>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius="80%"
            label
            labelLine={false}
          >
            {/* Use predefined colors for each pie slice */}
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
