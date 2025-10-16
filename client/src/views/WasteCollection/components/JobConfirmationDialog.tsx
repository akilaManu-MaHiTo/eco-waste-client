import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  LocalShipping as TruckIcon,
  Delete as WasteIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import CustomButton from "../../../components/CustomButton";
import { Delivery } from "../../../api/delivery.ts";

interface JobConfirmationDialogProps {
  open: boolean;
  delivery: Delivery | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const JobConfirmationDialog: React.FC<JobConfirmationDialogProps> = ({
  open,
  delivery,
  onClose,
  onConfirm,
  isPending,
}) => {
  if (!delivery) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: "primary.light",
              borderRadius: "50%",
              p: 1,
              display: "flex",
            }}
          >
            <AssignmentIcon color="primary" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Confirm Job Assignment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review details before accepting this collection job
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TruckIcon color="primary" />
                  Truck Details
                </Typography>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Truck ID
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {delivery.truck.truckId}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Capacity
                    </Typography>
                    <Typography variant="body1">
                      {delivery.truck.capacity}kg
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Current Location
                    </Typography>
                    <Typography variant="body1">
                      {delivery.truck.currentLocation}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Chip label={delivery.truck.status} size="small" />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <WasteIcon color="primary" />
                  Collection Summary
                </Typography>
                <Stack spacing={1}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Bins
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {delivery.garbage.length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Weight
                    </Typography>
                    <Typography variant="body1">
                      {delivery.garbage.reduce(
                        (total, item) => total + item.garbageId.wasteWeight,
                        0
                      )}
                      kg
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Price
                    </Typography>
                    <Typography
                      variant="body1"
                      color="success.main"
                      fontWeight="bold"
                    >
                      LKR{" "}
                      {delivery.garbage.reduce(
                        (total, item) => total + item.price,
                        0
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <LocationOnIcon color="primary" />
                  Collection Points ({delivery.garbage.length})
                </Typography>
                <Grid container spacing={2}>
                  {delivery.garbage.map((item) => (
                    <Grid item xs={12} sm={6} key={item._id}>
                      <Card
                        sx={{
                          bgcolor: "#f8f9fa",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {item.garbageId.binId.binId}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {item.garbageId.binId.location}
                          </Typography>
                          <Box display="flex" gap={1} mb={1}>
                            <Chip
                              label={`${item.garbageId.wasteWeight}kg`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={item.garbageId.garbageCategory}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Owner: {item.garbageId.createdBy.username}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="success.main"
                            fontWeight="bold"
                          >
                            Price: LKR {item.price}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          onClick={onConfirm}
          disabled={isPending}
          sx={{ borderRadius: 2, px: 4 }}
        >
          {isPending ? "Accepting..." : "Accept Job"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};
