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
  const renderLoader = (active = true) => (active ? <Skeleton variant="rectangular" height={72} /> : null);

  return (
    <Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
      <Typography variant="subtitle2" color="text.secondary">
        Last Collection
      </Typography>
      {loading && renderLoader(true)}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Unable to load collection history.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {formatDate(lastCollected?.createdAt as string)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatTime(lastCollected?.createdAt as string)}
          </Typography>
          {!lastCollected && (
            <Typography variant="body2" color="text.secondary">
              No collection events recorded yet.
            </Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export const NextCollectionCard = ({ loading, error, nextCollection, formatDate, formatTime }: any) => {
  const renderLoader = (active = true) => (active ? <Skeleton variant="rectangular" height={72} /> : null);

  return (
    <Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
      <Typography variant="subtitle2" color="text.secondary">
        Next Collection
      </Typography>
      {loading && renderLoader(true)}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Unable to load upcoming collections.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {formatDate(nextCollection?.createdAt as string, "Not scheduled")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatTime(nextCollection?.createdAt as string, "--")}
          </Typography>
          {nextCollection && nextCollection.status && (
            <Chip size="small" label={nextCollection.status} sx={{ alignSelf: "flex-start" }} />
          )}
          {!nextCollection && (
            <Typography variant="body2" color="text.secondary">
              No upcoming collection requests.
            </Typography>
          )}
        </Stack>
      )}
    </Paper>
  );
};

export const WasteCategoriesCard = ({ loading, error, categoryBreakdown }: any) => {
  return (
    <Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
      <Typography variant="subtitle2" color="text.secondary">
        Waste Categories
      </Typography>
      {loading && <Skeleton variant="rectangular" height={120} />}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Unable to load category summary.
        </Typography>
      )}
      {!loading && !error && categoryBreakdown?.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No waste categories logged yet.
        </Typography>
      )}
      {!loading && !error && categoryBreakdown?.length > 0 && (
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          {categoryBreakdown.slice(0, 4).map((item: any) => (
            <Box key={item.category}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.category}</Typography>
                <Typography variant="body2" color="text.secondary">{item.percent?.toFixed(0)}%</Typography>
              </Stack>
              <Box sx={{ mt: 0.5 }}>
                <div style={{ height: 6, background: '#f1f1f1', borderRadius: 9999 }}>
                  <div style={{ width: `${Math.min(100, item.percent)}%`, height: 6, background: '#4caf50', borderRadius: 9999 }} />
                </div>
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default null;
