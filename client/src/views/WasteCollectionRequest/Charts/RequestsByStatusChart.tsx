import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

interface RequestStatusData {
  _id: string;
  count: number;
}

interface Props {
  data: RequestStatusData[] | undefined;
  isLoading?: boolean;
}

export default function RequestsByStatusChart({ data, isLoading }: Props) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((item) => ({
      status: item._id,
      count: item.count
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
          <Typography variant="body2">{`Status: ${label}`}</Typography>
          <Typography variant="body2">{`Count: ${payload[0].value}`}</Typography>
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
        Requests by Status
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}