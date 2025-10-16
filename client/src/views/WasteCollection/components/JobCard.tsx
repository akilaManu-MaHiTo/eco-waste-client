import { Box, Card, CardContent, Chip, LinearProgress, Typography } from "@mui/material";
import CustomButton from "../../../components/CustomButton";

interface JobCardProps {
  truckId: string;
  jobId: string;
  status: string;
  capacity?: number;
  location?: string;
  binCount: number;
  totalWeight: number;
  progress?: number | string;
  onAction: () => void;
  actionLabel: string;
  actionVariant?: "contained" | "outlined";
  disabled?: boolean;
  isActive?: boolean;
  showProgress?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  truckId,
  jobId,
  status,
  capacity,
  location,
  binCount,
  totalWeight,
  progress,
  onAction,
  actionLabel,
  actionVariant = "contained",
  disabled = false,
  isActive = false,
  showProgress = false,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: isActive ? "2px solid #4caf50" : "1px solid #e0e0e0",
        bgcolor: isActive ? "#f8fff8" : "white",
        transition: "all 0.2s",
        "&:hover": { boxShadow: 3, ...(isActive ? {} : { borderColor: "#2196f3" }) },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {truckId}
          </Typography>
          <Chip
            label={isActive ? "ACTIVE" : status}
            color={isActive ? "success" : status === "Pending" ? "warning" : "default"}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          ID: {jobId}
        </Typography>

        {capacity && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Capacity: {capacity}kg
          </Typography>
        )}

        {location && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Location: {location}
          </Typography>
        )}

        {showProgress && progress !== undefined && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Progress: {progress}
            </Typography>
            {typeof progress === 'string' && progress.includes('/') && (
              <LinearProgress
                variant="determinate"
                value={(parseInt(progress.split('/')[0]) / parseInt(progress.split('/')[1])) * 100}
                sx={{ borderRadius: 1, height: 6 }}
              />
            )}
            {typeof progress === 'number' && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ borderRadius: 1, height: 6 }}
              />
            )}
          </Box>
        )}

        <Box
          sx={{
            bgcolor: "#f5f5f5",
            p: 2,
            borderRadius: 1,
            mb: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            {binCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Collection Points
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Total Weight: {totalWeight}kg
        </Typography>

        <CustomButton
          variant={actionVariant}
          size="small"
          onClick={onAction}
          disabled={disabled}
          sx={{ borderRadius: 2 }}
          fullWidth
        >
          {actionLabel}
        </CustomButton>
      </CardContent>
    </Card>
  );
};
