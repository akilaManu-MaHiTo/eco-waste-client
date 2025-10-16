import React from "react";
import { Box, LinearProgress, Paper, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RecyclingIcon from "@mui/icons-material/Recycling";
import { format, parseISO } from "date-fns";

export const CurrentLevelCard = ({ loading, error, overallPercentFilled }: any) => {
  const theme = useTheme();
  const renderLoader = (active = true) => (active ? <Skeleton variant="rectangular" height={128} /> : null);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: theme.palette.success.light + "33",
            color: theme.palette.success.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrendingUpIcon fontSize="small" />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Current Garbage Level
        </Typography>
      </Stack>
      {loading && renderLoader(true)}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Unable to load current garbage level.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={2.5} sx={{ mt: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            {overallPercentFilled.toFixed(0)}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, overallPercentFilled)}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                bgcolor: theme.palette.success.main,
              },
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Container is {overallPercentFilled.toFixed(0)}% full
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

export const LastCollectionCard = ({ loading, error, lastCollected, formatDate, formatTime }: any) => {
  const theme = useTheme();
  const renderLoader = (active = true) => (active ? <Skeleton variant="rectangular" height={128} /> : null);

  const formatDayTime = (value?: string) => {
    if (!value) return undefined;
    const parsed = parseISO(value);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return format(parsed, "EEEE 'at' p");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: theme.palette.primary.light + "33",
            color: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircleIcon fontSize="small" />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Last Collection
        </Typography>
      </Stack>
      {loading && renderLoader(true)}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Unable to load collection history.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={1} sx={{ mt: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {formatDate(lastCollected?.createdAt as string)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDayTime(lastCollected?.createdAt as string) ?? formatTime(lastCollected?.createdAt as string)}
          </Typography>
          {lastCollected?.binId?.binId && (
            <Typography variant="body2" color="text.secondary">
              Bin ID: <Typography component="span" variant="body2" fontWeight={600} color="text.primary">{lastCollected.binId.binId}</Typography>
            </Typography>
          )}
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
  const theme = useTheme();
  const renderLoader = (active = true) => (active ? <Skeleton variant="rectangular" height={128} /> : null);

  const formatDayTime = (value?: string) => {
    if (!value) return undefined;
    const parsed = parseISO(value);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return format(parsed, "EEEE 'at' p");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: theme.palette.info.light + "33",
            color: theme.palette.info.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EventAvailableIcon fontSize="small" />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Next Collection
        </Typography>
      </Stack>
      {loading && renderLoader(true)}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Unable to load upcoming collections.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={1} sx={{ mt: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {formatDate(nextCollection?.createdAt as string, "Not scheduled")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDayTime(nextCollection?.createdAt as string) ?? formatTime(nextCollection?.createdAt as string, "--")}
          </Typography>
          {nextCollection?.binId?.binId && (
            <Typography variant="body2" color="text.secondary">
              Bin ID: <Typography component="span" variant="body2" fontWeight={600} color="text.primary">{nextCollection.binId.binId}</Typography>
            </Typography>
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
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 3,
        bgcolor: "#fff",
        boxShadow: "0px 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: theme.palette.warning.light + "33",
            color: theme.palette.warning.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RecyclingIcon fontSize="small" />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Waste Categories
        </Typography>
      </Stack>
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
        <Stack spacing={1.5} sx={{ mt: 3 }}>
          {categoryBreakdown.slice(0, 4).map((item: any) => (
            <Stack key={item.category} direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {item.category}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {item.percent?.toFixed(0)}%
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default null;