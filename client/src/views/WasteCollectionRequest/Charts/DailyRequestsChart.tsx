import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { format, parseISO } from 'date-fns';

interface DailyRequestData {
  totalRequests: number;
  year: number;
  month: number;
  day: number;
  date: string;
}

interface Props {
  data: DailyRequestData[] | undefined;
  isLoading?: boolean;
}

export default function DailyRequestsChart({ data, isLoading }: Props) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data
      .map((item) => ({
        date: item.date,
        requests: item.totalRequests,
        day: item.day,
        month: item.month,
        year: item.year,
        formattedDate: format(parseISO(item.date), 'MMM dd')
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
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
          <Typography variant="body2">{`Date: ${format(parseISO(data.date), 'MMM dd, yyyy')}`}</Typography>
          <Typography variant="body2">{`Requests: ${data.requests}`}</Typography>
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
        Daily Requests Timeline
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="requests" 
            stroke="#00C49F" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#00C49F' }}
            activeDot={{ r: 7, fill: '#00C49F' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}