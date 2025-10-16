import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { CheckCircle as CheckIcon, LocationOn as LocationOnIcon } from "@mui/icons-material";
import CustomButton from "../../../components/CustomButton";

interface CollectionPointCardProps {
  binId: string;
  location: string;
  weight: number;
  category: string;
  owner: string;
  phone?: string;
  price?: number;
  isCompleted: boolean;
  onComplete?: () => void;
  isCompletionPending?: boolean;
  showPrice?: boolean;
}

export const CollectionPointCard: React.FC<CollectionPointCardProps> = ({
  binId,
  location,
  weight,
  category,
  owner,
  phone,
  price,
  isCompleted,
  onComplete,
  isCompletionPending = false,
  showPrice = false,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        border: isCompleted ? "2px solid #4caf50" : "1px solid #e0e0e0",
        bgcolor: isCompleted ? "#f8fff8" : "white",
        transition: "all 0.2s",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            {binId}
          </Typography>
          {isCompleted ? (
            <CheckIcon color="success" />
          ) : (
            <LocationOnIcon color="warning" />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {location}
        </Typography>
        
        <Typography
          variant="caption"
          sx={{
            bgcolor: "#f5f5f5",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            display: "inline-block",
            mb: 2,
          }}
        >
          {weight}kg • {category}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: showPrice ? 1 : 2 }}>
          Owner: {owner} {phone && `(${phone})`}
        </Typography>

        {showPrice && price && (
          <Typography variant="body2" color="success.main" fontWeight="bold" sx={{ mb: 2 }}>
            Price: LKR {price}
          </Typography>
        )}

        {!isCompleted && onComplete ? (
          <CustomButton
            variant="contained"
            size="small"
            onClick={onComplete}
            disabled={isCompletionPending}
            sx={{ borderRadius: 2 }}
            fullWidth
          >
            Complete
          </CustomButton>
        ) : (
          <Chip
            label="Completed"
            color="success"
            size="small"
            sx={{ width: "100%", borderRadius: 2 }}
          />
        )}
      </CardContent>
    </Card>
  );
};
