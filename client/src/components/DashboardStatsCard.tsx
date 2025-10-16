import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface DashboardStatsCardProps {
  title: string;
  value: number | string;
  icon: SvgIconComponent;
  color?: string;
  isLoading?: boolean;
  subtitle?: string;
}

export default function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  color = '#1976d2',
  isLoading = false,
  subtitle
}: DashboardStatsCardProps) {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 120,
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        border: `1px solid ${color}30`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}20`
        }
      }}
    >
      <Box>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          gutterBottom 
          sx={{ fontSize: '0.875rem', fontWeight: 500 }}
        >
          {title}
        </Typography>
        
        {isLoading ? (
          <CircularProgress size={24} sx={{ color }} />
        ) : (
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 'bold', 
              color,
              fontSize: '2rem',
              lineHeight: 1
            }}
          >
            {value}
          </Typography>
        )}
        
        {subtitle && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: '50%',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon sx={{ fontSize: 40, color }} />
      </Box>
    </Paper>
  );
}