import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {
  LocalShipping as TruckIcon,
  CheckCircle as CheckIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import CustomButton from "../../../components/CustomButton";
import { Delivery } from "../../../api/delivery.ts";
import { MapContainer } from "./MapContainer";
import { MarkerF } from "@react-google-maps/api";
import { CollectionPointCard } from "./CollectionPointCard";

interface ActiveJobCardProps {
  activeJob: Delivery;
  completedBins: Set<string>;
  isLoaded: boolean;
  loadError: Error | undefined;
  directions: google.maps.DirectionsResult | null;
  mapCenter: google.maps.LatLngLiteral;
  dumpLocation: google.maps.LatLngLiteral;
  onViewDetails: () => void;
  onCompleteBin: (garbageId: string) => void;
  onCompleteDelivery: () => void;
  isCompletionPending: boolean;
  isDeliveryPending: boolean;
  getValidCoordinates: (
    lat: number | undefined,
    lng: number | undefined,
    fallback?: google.maps.LatLngLiteral
  ) => google.maps.LatLngLiteral;
}

export const ActiveJobCard: React.FC<ActiveJobCardProps> = ({
  activeJob,
  completedBins,
  isLoaded,
  loadError,
  directions,
  mapCenter,
  dumpLocation,
  onViewDetails,
  onCompleteBin,
  onCompleteDelivery,
  isCompletionPending,
  isDeliveryPending,
  getValidCoordinates,
}) => {
  const allBinsCompleted = activeJob.garbage.every((item) =>
    completedBins.has(item.garbageId._id)
  );

  return (
    <Card
      sx={{
        mb: 4,
        borderRadius: 3,
        background: "linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)",
        border: "2px solid #4caf50",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#4caf50",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                p: 1,
                display: "flex",
              }}
            >
              <TruckIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Active Collection
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {activeJob.truck.truckId} • ID: {activeJob._id.slice(-8)}
              </Typography>
            </Box>
          </Box>
          <Chip
            label="IN PROGRESS"
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {completedBins.size}/{activeJob.garbage.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bins Completed
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(completedBins.size / activeJob.garbage.length) * 100}
                      sx={{ mt: 1, borderRadius: 1, height: 6 }}
                    />
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {activeJob.garbage.reduce(
                        (total, item) => total + item.garbageId.wasteWeight,
                        0
                      )}
                      kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Weight
                    </Typography>
                  </CardContent>
                </Card>

                <CustomButton
                  variant="outlined"
                  size="large"
                  onClick={onViewDetails}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    borderColor: "#4caf50",
                    color: "#4caf50",
                    "&:hover": {
                      bgcolor: "#4caf50",
                      color: "white",
                    },
                  }}
                  fullWidth
                >
                  View Route Details
                </CustomButton>
              </Stack>
            </Grid>

            {/* Live Map */}
            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 2, overflow: "hidden", height: 300 }}>
                <MapContainer
                  isLoaded={isLoaded}
                  loadError={loadError}
                  center={mapCenter}
                  zoom={13}
                  directions={directions}
                  height={300}
                >
                  <MarkerF
                    position={getValidCoordinates(
                      activeJob.truck.latitude,
                      activeJob.truck.longitude,
                      dumpLocation
                    )}
                    title={`Truck: ${activeJob.truck.truckId}`}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                  />

                  {activeJob.garbage.map((item) => {
                    const isCompleted = completedBins.has(item.garbageId._id);
                    const position = getValidCoordinates(
                      item.garbageId?.binId?.latitude,
                      item.garbageId?.binId?.longitude
                    );

                    return (
                      <MarkerF
                        key={item._id}
                        position={position}
                        title={`Bin: ${item.garbageId?.binId?.binId} - ${
                          isCompleted ? "Completed" : "Pending"
                        }`}
                        icon={
                          isCompleted
                            ? {
                                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                              }
                            : {
                                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                              }
                        }
                      />
                    );
                  })}

                  <MarkerF
                    position={dumpLocation}
                    title="Dump Location"
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                    }}
                  />
                </MapContainer>
              </Card>
            </Grid>

            {/* Collection Points */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <LocationOnIcon color="primary" />
                    Collection Points ({activeJob.garbage.length})
                  </Typography>

                  <Grid container spacing={2}>
                    {activeJob.garbage.map((item) => {
                      const isCompleted = completedBins.has(item.garbageId._id);
                      return (
                        <Grid item xs={12} sm={6} md={4} key={item._id}>
                          <CollectionPointCard
                            binId={item.garbageId.binId.binId}
                            location={item.garbageId.binId.location}
                            weight={item.garbageId.wasteWeight}
                            category={item.garbageId.garbageCategory}
                            owner={item.garbageId.createdBy.username}
                            isCompleted={isCompleted}
                            onComplete={() => onCompleteBin(item.garbageId._id)}
                            isCompletionPending={isCompletionPending}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>

                  {allBinsCompleted && (
                    <Card
                      sx={{
                        mt: 3,
                        bgcolor: "#e8f5e8",
                        border: "2px solid #4caf50",
                        borderRadius: 2,
                      }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center" gap={2}>
                            <CheckIcon color="success" sx={{ fontSize: 32 }} />
                            <Box>
                              <Typography
                                variant="h6"
                                color="success.dark"
                                fontWeight="bold"
                              >
                                All bins collected!
                              </Typography>
                              <Typography variant="body2" color="success.dark">
                                Ready to complete delivery
                              </Typography>
                            </Box>
                          </Box>
                          <CustomButton
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={onCompleteDelivery}
                            disabled={isDeliveryPending}
                            sx={{ borderRadius: 2, px: 4 }}
                          >
                            {isDeliveryPending ? "Completing..." : "Complete Delivery"}
                          </CustomButton>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
