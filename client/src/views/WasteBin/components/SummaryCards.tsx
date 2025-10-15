import React from "react";
import { Box, Chip, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { CircularProgressWithLabel } from "../../../components/CircularProgressWithLabel";

export const CurrentLevelCard = ({ loading, error, overallPercentFilled }: any) => {
  const renderLoader = (active = true) => (active ? <Skeleton variant="rectangular" height={72} /> : null);

  return (
    <Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
      <Typography variant="subtitle2" color="text.secondary">
        Current Garbage Level
      </Typography>
      {loading && renderLoader(true)}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Unable to load current garbage level.
        </Typography>
      )}
      {!loading && !error && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          <CircularProgressWithLabel value={overallPercentFilled} />
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {overallPercentFilled.toFixed(0)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Container is {overallPercentFilled.toFixed(0)}% full.
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
