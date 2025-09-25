import { Box, Typography } from "@mui/material";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

type PieChartData = {
  name: string;
  value: number;
};

type CustomPieChartProps = {
  data: PieChartData[];
  colors?: string[];
  width?: number | string;
  height?: number | string;
  title?: string;
  centerLabel?: string;
  innerRadius?: number;
  outerRadius?: number;
};

// Custom tooltip to display just the value without a dash
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p>{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CustomPieChart: React.FC<CustomPieChartProps> = ({
  data,
  colors = [
    "#0D47A1", // Dark Blue
    "#16C47F", // Green
    "#FF7043", // Orange
    "#AB47BC", // Purple
    "#29B6F6", // Light Blue
    "#EF5350", // Red
    "#FFCA28", // Amber
    "#66BB6A", // Light Green
    "#5C6BC0", // Indigo
    "#FFA726", // Orange Accent
    "#26C6DA", // Cyan
    "#8D6E63", // Brown
  ],
  width = 400,
  height = 400,
  title,
  centerLabel,
  innerRadius = 90,
  outerRadius = 120,
}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {title && (
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
      )}
      <div style={{ width, height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={1}
              cornerRadius={5}
              cx="50%"
              cy="50%"
              dataKey="value"
              label={false}
            >
              {centerLabel && (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#333"
                  fontSize={16}
                  fontWeight="bold"
                >
                  {centerLabel}
                </text>
              )}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Box>
  );
};

export default CustomPieChart;
