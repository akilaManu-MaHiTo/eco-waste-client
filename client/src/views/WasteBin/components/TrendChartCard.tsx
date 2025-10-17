import React from "react";
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Visualises recent waste generation trends with contextual date range copy.
const TrendChartCard = ({ loading, error, trendChartData, startDate, endDate, theme }: any) => {
  return (
    <Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Waste Generation Trend</Typography>
        {startDate && endDate && (
          <Typography variant="caption" color="text.secondary">{`${startDate} - ${endDate}`}</Typography>
        )}
      </Stack>
      {/* Keep chart footprint reserved while analytics data loads. */}
      {loading && <Skeleton variant="rectangular" height={260} />}
      {error && (
        <Typography variant="body2" color="error">Unable to load trend data.</Typography>
      )}
      {/* Avoid rendering empty charts when the dataset has no points. */}
      {!loading && !error && trendChartData?.length === 0 && (
        <Typography variant="body2" color="text.secondary">No waste generation data found for the selected period.</Typography>
      )}
      {!loading && !error && trendChartData?.length > 0 && (
        <Box sx={{ width: "100%", height: 260 }}>
          {/* Responsive container ensures the line chart adjusts to the card layout. */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendChartData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`${value.toFixed(2)} kg`, "Waste"]} />
              <Line type="monotone" dataKey="totalWeight" stroke={theme.palette.primary.main} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default TrendChartCard;
