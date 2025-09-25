import * as React from 'react';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface CircularProgressWithLabelAIProps extends CircularProgressProps {
  daysSince: number; // Accept daysSince as a prop
  size?: number;
  nameValue?: string;
}

function CircularProgressWithLabelAI(
  props: CircularProgressWithLabelAIProps
) {
  const { daysSince, size = 40, nameValue } = props;

  // 3 months = 90 days. Progress bar should reset every 3 months
  const cycleLength = 90; // 90 days for 3 months

  // Ensure that we show full 100% on day 90, not reset it prematurely
  const progressCycle = daysSince % cycleLength; // Get the current progress within a 90-day cycle

  // Calculate the percentage of the progress (this will show 100% at day 90)
  const progress = progressCycle === 0 ? 100 : (progressCycle / cycleLength) * 100;

  // Calculate the month count by dividing by 30 days per month (approx.)
  const monthCount = Math.floor(daysSince / 30);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        sx={{
          color: 'lightgray', // Gray background progress bar
        }}
      />
      <CircularProgress
        variant="determinate"
        value={progress}
        size={size}
        sx={{
          color: progress > 0 ? 'var(--pallet-blue)' : 'transparent', // Blue progress bar
          position: 'absolute',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        {/* <Typography
          variant="overline"
          component="div"
          sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
        >
          {`Days Since Last ${nameValue}`}
        </Typography> */}
        <Typography
          variant='h5'
        >
          {daysSince} Days
        </Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressWithLabelAI;
