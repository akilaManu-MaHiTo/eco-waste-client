import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

interface RevenueData {
  _id: string;
  totalRevenue: number;
  currency: string;
}

interface Props {
  data: RevenueData[] | undefined;
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function RevenueByCategoryChart({ data, isLoading }: Props) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((item, index) => ({
      name: item._id,
      value: item.totalRevenue,
      currency: item.currency,
      fill: COLORS[index % COLORS.length]
    }));
  }, [data]);

  const totalRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="body2">{`Category: ${data.name}`}</Typography>
          <Typography variant="body2">{`Revenue: ${data.value} ${data.currency}`}</Typography>
        </Box>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Revenue by Category
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Total Revenue: {totalRevenue} {chartData[0]?.currency || 'LKR'}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}