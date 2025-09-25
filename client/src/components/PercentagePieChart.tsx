import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Typography, Box, Stack } from "@mui/material";

interface PercentagePieChartProps {
  data: {
    reusePercentage: number;
    recyclePercentage: number;
  };
  title?: string;
  width?: number;
  height?: number;
}

export default function PercentagePieChart({
  data,
  title = "Recycled Water Breakdown",
  width = 350,
  height = 350,
}: PercentagePieChartProps) {
  const chartData = [
    { name: "Recycled", value: data?.recyclePercentage },
    { name: "Reused", value: data?.reusePercentage },
    { name: "Others", value: 100 - data?.recyclePercentage - data?.reusePercentage },
  ];

  const COLORS = ["#10b981", "#4f46e5", "#f59e0b"];

  return (
    <Box>
      {title && (
        <Typography variant="h6" mb={2} display="flex" justifyContent="center">
          {title}
        </Typography>
      )}

      <Box display="flex" justifyContent="center">
        <ResponsiveContainer width={width} height={height}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius="80%"
              label={({ value }) => `${value.toFixed(1)}%`}
              labelLine={false}
              fontSize={15}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={3}>
        <Stack gap={2} flexDirection={"row"}>
          {chartData.map((item, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1}>
              <Box
                width={14}
                height={14}
                borderRadius="50%"
                bgcolor={COLORS[i]}
              />
              <Typography fontSize={14}>
                {item.name}: {item?.value?.toFixed(1)}%
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
