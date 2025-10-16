import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { MarkerF, InfoWindow } from "@react-google-maps/api";
import CustomButton from "../../../components/CustomButton";
import { Delivery } from "../../../api/delivery.ts";
import { MapContainer } from "./MapContainer";
import { CollectionPointCard } from "./CollectionPointCard";

interface RouteMapDialogProps {
  open: boolean;
  delivery: Delivery | null;
  completedBins: Set<string>;
  isLoaded: boolean;
  loadError: Error | undefined;
  directions: google.maps.DirectionsResult | null;
  mapCenter: google.maps.LatLngLiteral;
  dumpLocation: google.maps.LatLngLiteral;
  selectedMarker: string | null;
  onClose: () => void;
  onMapLoad: (map: google.maps.Map) => void;
  onMarkerClick: (markerId: string) => void;
  onCloseMarker: () => void;
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

export const RouteMapDialog: React.FC<RouteMapDialogProps> = ({
  open,
  delivery,
  completedBins,
  isLoaded,
  loadError,
  directions,
  mapCenter,
  dumpLocation,
  selectedMarker,
  onClose,
  onMapLoad,
  onMarkerClick,
  onCloseMarker,
  onCompleteBin,
  onCompleteDelivery,
  isCompletionPending,
  isDeliveryPending,
  getValidCoordinates,
}) => {
  if (!delivery) return null;

  const allBinsCompleted = delivery.garbage.every((item) =>
    completedBins.has(item.garbageId._id)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
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
            <LocationOnIcon color="primary" />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Collection Route
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track collection progress and manage bin completion
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, overflow: "hidden", height: 400 }}>
              <MapContainer
                isLoaded={isLoaded}
                loadError={loadError}
                center={mapCenter}
                zoom={12}
                onLoad={onMapLoad}
                directions={directions}
                height={400}
                options={{
                  fullscreenControl: true,
                }}
              >
                <MarkerF
                  position={getValidCoordinates(
                    delivery.truck.latitude,
                    delivery.truck.longitude,
                    dumpLocation
                  )}
                  title={`Truck: ${delivery.truck.truckId}`}
                  onClick={() => onMarkerClick("truck")}
                />

                {delivery.garbage.map((item) => {
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
                      onClick={() => onMarkerClick(item._id)}
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
                  onClick={() => onMarkerClick("dump")}
                  icon={{
                    url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  }}
                />

                {selectedMarker && (
                  <InfoWindow
                    position={
                      selectedMarker === "truck"
                        ? getValidCoordinates(
                            delivery.truck.latitude,
                            delivery.truck.longitude
                          )
                        : selectedMarker === "dump"
                        ? dumpLocation
                        : getValidCoordinates(
                            delivery.garbage.find((g) => g._id === selectedMarker)
                              ?.garbageId?.binId?.latitude,
                            delivery.garbage.find((g) => g._id === selectedMarker)
                              ?.garbageId?.binId?.longitude
                          )
                    }
                    onCloseClick={onCloseMarker}
                  >
                    <div>
                      {selectedMarker === "truck" && (
                        <div>
                          <strong>Truck</strong>
                          <br />
                          ID: {delivery.truck.truckId}
                          <br />
                          Status: {delivery.truck.status}
                        </div>
                      )}
                      {selectedMarker === "dump" && (
                        <div>
                          <strong>Dump Location</strong>
                          <br />
                          Final destination
                        </div>
                      )}
                      {selectedMarker !== "truck" &&
                        selectedMarker !== "dump" &&
                        (() => {
                          const garbageItem = delivery.garbage.find(
                            (g) => g._id === selectedMarker
                          );
                          const isCompleted = completedBins.has(
                            garbageItem?.garbageId._id || ""
                          );
                          return (
                            <div>
                              <strong>Bin {garbageItem?.garbageId.binId.binId}</strong>
                              <br />
                              Status: {isCompleted ? "Completed" : "Pending"}
                              <br />
                              Weight: {garbageItem?.garbageId.wasteWeight}kg
                            </div>
                          );
                        })()}
                    </div>
                  </InfoWindow>
                )}
              </MapContainer>
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
                  Collection Points Progress
                </Typography>
                <Grid container spacing={2}>
                  {delivery.garbage.map((item) => {
                    const isCompleted = completedBins.has(item.garbageId._id);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <CollectionPointCard
                          binId={item.garbageId.binId.binId}
                          location={item.garbageId.binId.location}
                          weight={item.garbageId.wasteWeight}
                          category={item.garbageId.garbageCategory}
                          owner={item.garbageId.createdBy.username}
                          phone={item.garbageId.createdBy.mobile}
                          isCompleted={isCompleted}
                          onComplete={() => onCompleteBin(item.garbageId._id)}
                          isCompletionPending={isCompletionPending}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {allBinsCompleted && (
            <Grid item xs={12}>
              <Card
                sx={{
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
                      onClick={onCompleteDelivery}
                      disabled={isDeliveryPending}
                      sx={{ borderRadius: 2, px: 4 }}
                    >
                      {isDeliveryPending ? "Completing..." : "Complete Delivery"}
                    </CustomButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
