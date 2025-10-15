import React from "react";
import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";

const getBinLabel = (b: any) => {
  if (!b) return "Bin";
  if (b.binName) return String(b.binName);
  if (typeof b.binId === "string") return b.binId;
  if (b.binId && typeof b.binId === "object") {
    if (typeof b.binId.binId === "string") return b.binId.binId;
    if (typeof b.binId._id === "string") return b.binId._id;
  }
  return "Bin";
};

const BinUtilization = ({ loading, error, levelData }: any) => {
  return (
    <Paper elevation={2} sx={{ padding: 3 }}>
      <Typography variant="h6">Bin Utilization</Typography>
      {loading && <div style={{ height: 160 }} />}
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>Unable to load bin utilization data.</Typography>
      )}
      {!loading && !error && (levelData?.bins?.length ?? 0) === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>No bin utilization records available yet.</Typography>
      )}
      {!loading && !error && (levelData?.bins?.length ?? 0) > 0 && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {levelData.bins.map((bin: any) => {
            const binLabel = getBinLabel(bin);
            return (
              <Box key={binLabel}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{binLabel}</Typography>
                  <Typography variant="body2" color="text.secondary">{bin.percentFilled.toFixed(0)}%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={Math.min(100, bin.percentFilled)} sx={{ height: 8, borderRadius: 9999 }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">{(bin.totalWeight ?? 0).toFixed(2)} kg / {(bin.capacity ?? 0).toFixed(2)} kg</Typography>
                  <Typography variant="caption" color="text.secondary">{bin.deposits ?? 0} deposits</Typography>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};

export default BinUtilization;
