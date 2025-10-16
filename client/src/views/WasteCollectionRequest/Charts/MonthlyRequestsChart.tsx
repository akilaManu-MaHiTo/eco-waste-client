import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

interface MonthlyRequestData {
  totalRequests: number;
  year: number;
  month: string;
}

interface Props {
  data: MonthlyRequestData[] | undefined;
  isLoading?: boolean;
}

export default function MonthlyRequestsChart({ data, isLoading }: Props) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((item) => ({
      month: `${item.month} ${item.year}`,
      requests: item.totalRequests,
      year: item.year
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
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
          <Typography variant="body2">{`Month: ${label}`}</Typography>
          <Typography variant="body2">{`Requests: ${payload[0].value}`}</Typography>
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
        Monthly Requests
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="requests" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}