import React from "react";
import { Box, Chip, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

// Presents a concise table of recent waste collection events with status badges.
const CollectionHistory = ({ loading, error, historyPreview, formatDate, formatTime }: any) => {
  return (
    <Box>
      <Typography variant="h6" mb={2}>Collection History</Typography>
      {/* Show skeleton state while the history request resolves. */}
      {loading && <Skeleton variant="rectangular" height={220} />}
      {error && (
        <Typography variant="body2" color="error">Unable to load collection history.</Typography>
      )}
      {/* Communicate lack of results when the API returns an empty set. */}
      {!loading && !error && historyPreview?.length === 0 && (
        <Typography variant="body2" color="text.secondary">No collection records available.</Typography>
      )}
      {!loading && !error && historyPreview?.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Waste Type</TableCell>
                <TableCell align="right">Amount (kg)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyPreview.map((entry: any) => {
                const createdAt = entry.createdAt as string;
                const status = entry.status ?? "--";

                return (
                  <TableRow key={entry._id}>
                    <TableCell>{formatDate(createdAt)}</TableCell>
                    <TableCell>{formatTime(createdAt)}</TableCell>
                    <TableCell>{entry.garbageCategory}</TableCell>
                    <TableCell align="right">{(entry.wasteWeight ?? 0).toFixed(2)}</TableCell>
                    {/* Status chip highlights collection progress at a glance. */}
                    <TableCell>
                      <Chip size="small" label={status} color={status.toLowerCase() === "collected" ? "success" : status.toLowerCase() === "requested" ? "info" : "warning"} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CollectionHistory;
