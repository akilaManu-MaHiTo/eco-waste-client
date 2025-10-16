import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import { format, parseISO } from 'date-fns';

interface DailyCollectionData {
  _id: string;
  totalWeight: number;
  count: number;
}

interface Props {
  data: DailyCollectionData[] | undefined;
  isLoading?: boolean;
}

export default function DailyCollectionsChart({ data, isLoading }: Props) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data
      .map((item) => ({
        date: item._id,
        weight: item.totalWeight,
        count: item.count,
        formattedDate: format(parseISO(item._id), 'MMM dd')
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
          <Typography variant="body2">{`Date: ${data.date}`}</Typography>
          <Typography variant="body2">{`Weight: ${data.weight} kg`}</Typography>
          <Typography variant="body2">{`Collections: ${data.count}`}</Typography>
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
        Daily Collections
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="formattedDate" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}