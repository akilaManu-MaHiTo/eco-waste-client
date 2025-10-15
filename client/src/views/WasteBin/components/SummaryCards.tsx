import React from "react";
import { Box, Chip, LinearProgress, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { CircularProgressWithLabel } from "../../../components/CircularProgressWithLabel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HistoryIcon from "@mui/icons-material/History";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CategoryIcon from "@mui/icons-material/Category";

export const CurrentLevelCard = ({ loading, error, overallPercentFilled }: any) => {
  const getStatusColor = (percent: number) => {
    if (percent >= 80) return "#f44336";
    if (percent >= 60) return "#ff9800";
    return "#4caf50";
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: 3, 
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -50,
          right: -50,
          width: 150,
          height: 150,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <DeleteOutlineIcon sx={{ fontSize: 24 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
          Current Garbage Level
        </Typography>
      </Stack>
      {loading && <Skeleton variant="rectangular" height={120} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />}
      {error && (
        <Typography variant="body2" sx={{ mt: 2, color: "rgba(255,255,255,0.9)" }}>
          Unable to load current garbage level.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={2} sx={{ mt: 2, position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgressWithLabel value={overallPercentFilled} />
          </Box>
          <Stack spacing={0.5} alignItems="center">
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {overallPercentFilled.toFixed(0)}%
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Container is {overallPercentFilled.toFixed(0)}% full
            </Typography>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
};

export const LastCollectionCard = ({ loading, error, lastCollected, formatDate, formatTime }: any) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: 3, 
        height: "100%",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 120,
          height: 120,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <HistoryIcon sx={{ fontSize: 24 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
          Last Collection
        </Typography>
      </Stack>
      {loading && <Skeleton variant="rectangular" height={120} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />}
      {error && (
        <Typography variant="body2" sx={{ mt: 2, color: "rgba(255,255,255,0.9)" }}>
          Unable to load collection history.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={1.5} sx={{ mt: 2, position: "relative", zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {formatDate(lastCollected?.createdAt as string)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ScheduleIcon sx={{ fontSize: 20 }} />
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {formatTime(lastCollected?.createdAt as string)}
            </Typography>
          </Stack>
          {!lastCollected && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              No collection events recorded yet.
            </Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export const NextCollectionCard = ({ loading, error, nextCollection, formatDate, formatTime }: any) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: 3, 
        height: "100%",
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <ScheduleIcon sx={{ fontSize: 24 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
          Next Collection
        </Typography>
      </Stack>
      {loading && <Skeleton variant="rectangular" height={120} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />}
      {error && (
        <Typography variant="body2" sx={{ mt: 2, color: "rgba(255,255,255,0.9)" }}>
          Unable to load upcoming collections.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={1.5} sx={{ mt: 2, position: "relative", zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {formatDate(nextCollection?.createdAt as string, "Not scheduled")}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ScheduleIcon sx={{ fontSize: 20 }} />
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {formatTime(nextCollection?.createdAt as string, "--")}
            </Typography>
          </Stack>
          {nextCollection && nextCollection.status && (
            <Chip 
              size="small" 
              label={nextCollection.status} 
              sx={{ 
                alignSelf: "flex-start",
                bgcolor: "rgba(255,255,255,0.3)",
                color: "white",
                fontWeight: 600
              }} 
            />
          )}
          {!nextCollection && (
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              No upcoming collection requests.
            </Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export const WasteCategoriesCard = ({ loading, error, categoryBreakdown }: any) => {
  const categoryColors: Record<string, string> = {
    Plastic: "#2196f3",
    Paper: "#ff9800",
    Glass: "#4caf50",
    Metal: "#9c27b0",
    Organic: "#8bc34a",
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        padding: 3, 
        height: "100%",
        background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          bottom: -50,
          right: -50,
          width: 160,
          height: 160,
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <CategoryIcon sx={{ fontSize: 24 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
          Waste Categories
        </Typography>
      </Stack>
      {loading && <Skeleton variant="rectangular" height={120} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />}
      {error && (
        <Typography variant="body2" sx={{ mt: 2, color: "rgba(255,255,255,0.9)" }}>
          Unable to load category summary.
        </Typography>
      )}
      {!loading && !error && categoryBreakdown?.length === 0 && (
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
          No waste categories logged yet.
        </Typography>
      )}
      {!loading && !error && categoryBreakdown?.length > 0 && (
        <Stack spacing={2} sx={{ mt: 2, position: "relative", zIndex: 1 }}>
          {categoryBreakdown.slice(0, 3).map((item: any) => {
            const color = categoryColors[item.category] || "#ffffff";
            return (
              <Box key={item.category}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.category}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.percent?.toFixed(0)}%</Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(100, item.percent)} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 9999,
                    bgcolor: "rgba(255,255,255,0.3)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "white",
                      borderRadius: 9999
                    }
                  }} 
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};

export default null;
