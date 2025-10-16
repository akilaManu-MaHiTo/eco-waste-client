import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Button,
  Chip,
  colors,
  LinearProgress,
  Stack,
  TableFooter,
  TablePagination,
  Theme,
  Typography,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  LocalShipping as TruckIcon,
  Delete as WasteIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
  MarkerF,
} from "@react-google-maps/api";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useMemo, useState, useEffect, useCallback } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

import { PermissionKeys } from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import CustomButton from "../../components/CustomButton";
import { deleteWasteBin, fetchWasteBins, WasteBin } from "../../api/wasteBin";
import {
  deleteTruck,
  fetchTrucks,
  Truck,
  updateTruckAvailable,
  updateTruckInService,
  updateTruckWasteLoad,
} from "../../api/truck.ts";
import {
  fetchAllPendingRequests,
  fetchAllInProgressRequests,
  updateDeliveryStatusCompleted,
} from "../../api/garbageRequestApi.ts";

// Types for the delivery data
interface DeliveryData {
  _id: string;
  garbage: Array<{
    _id: string;
    garbageId: {
      _id: string;
      wasteWeight: number;
      garbageCategory: string;
      status: string;
      binId: {
        _id: string;
        binId: string;
        location: string;
        currentWasteLevel: number;
        thresholdLevel: number;
        binType: string;
        availability: boolean;
        latitude: number;
        longitude: number;
      };
      createdBy: {
        _id: string;
        username: string;
        mobile: string;
        email: string;
      };
    };
    price: number;
    currency: string;
    status: string;
    dateAndTime: string;
  }>;
  truck: {
    _id: string;
    truckId: string;
    capacity: number;
    status: string;
    currentLocation: string;
    latitude: number;
    longitude: number;
  };
  deliveryStatus: string;
}

const DEFAULT_DUMP_LOCATION = { lat: 6.9271, lng: 79.8612 };

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Custom marker icons
const createCustomIcon = (color: string) => ({
  path: window.google?.maps.SymbolPath.CIRCLE || 0,
  fillColor: color,
  fillOpacity: 1,
  strokeWeight: 2,
  strokeColor: "#ffffff",
  scale: 10,
});

function DailyCollection() {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryData | null>(
    null
  );
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [completedBins, setCompletedBins] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  // handle pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const breadcrumbItems = [
    { title: "Waste Collection", href: "/home" },
    { title: `Daily Collection` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const {
    data: deliveryData,
    isFetching: isDeliveryDataFetching,
    refetch,
  } = useQuery({
    queryKey: ["delivery-data"],
    queryFn: fetchAllPendingRequests,
  });

  const {
    data: inProgressData,
    isFetching: isInProgressDataFetching,
    refetch: refetchInProgress,
  } = useQuery({
    queryKey: ["inprogress-delivery-data"],
    queryFn: fetchAllInProgressRequests,
  });

  // Mutations
  const acceptJobMutation = useMutation({
    mutationFn: ({
      truckId,
      collectId,
    }: {
      truckId: string;
      collectId: string;
    }) => updateTruckInService(truckId, collectId),
    onSuccess: () => {
      enqueueSnackbar("Job accepted successfully!", { variant: "success" });
      refetch();
      refetchInProgress();
      setShowJobDetails(false);
      setShowRouteMap(true);
    },
    onError: (error) => {
      enqueueSnackbar("Failed to accept job", { variant: "error" });
      console.error("Accept job error:", error);
    },
  });

  const completeCollectionMutation = useMutation({
    mutationFn: ({
      truckId,
      garbageId,
    }: {
      truckId: string;
      garbageId: string;
    }) => updateTruckWasteLoad(truckId, garbageId),
    onSuccess: (_, variables) => {
      enqueueSnackbar("Bin collection completed!", { variant: "success" });
      setCompletedBins((prev) => new Set(prev).add(variables.garbageId));
    },
    onError: (error) => {
      enqueueSnackbar("Failed to complete bin collection", {
        variant: "error",
      });
      console.error("Complete collection error:", error);
    },
  });

  const completeDeliveryMutation = useMutation({
    mutationFn: ({
      truckId,
      collectId,
    }: {
      truckId: string;
      collectId: string;
    }) => updateTruckAvailable(truckId, collectId),
    onSuccess: () => {
      enqueueSnackbar("Delivery completed successfully!", {
        variant: "success",
      });
      refetch();
      refetchInProgress();
      setShowRouteMap(false);
      setSelectedDelivery(null);
      setCompletedBins(new Set());
    },
    onError: (error) => {
      enqueueSnackbar("Failed to complete delivery", { variant: "error" });
      console.error("Complete delivery error:", error);
    },
  });

  const isTruckCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_CREATE
  );
  const isTruckEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_EDIT
  );
  const isTruckDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_DELETE
  );

  const handleAcceptJob = (delivery: DeliveryData) => {
    setSelectedDelivery(delivery);
    setShowJobDetails(true);
  };

  const confirmAcceptJob = () => {
    if (selectedDelivery) {
      acceptJobMutation.mutate({
        truckId: selectedDelivery.truck._id,
        collectId: selectedDelivery._id,
      });
    }
  };

  const handleCompleteBinCollection = (garbageId: string) => {
    if (selectedDelivery) {
      completeCollectionMutation.mutate({
        truckId: selectedDelivery.truck._id,
        garbageId,
      });
    }
  };

  const handleCompleteDelivery = () => {
    if (selectedDelivery) {
      completeDeliveryMutation.mutate({
        truckId: selectedDelivery.truck._id,
        collectId: selectedDelivery._id,
      });
    }
  };

  const allBinsCompleted =
    selectedDelivery?.garbage.every((item) =>
      completedBins.has(item.garbageId._id)
    ) || false;

  const paginatedData =
    deliveryData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) ||
    [];

  // Fix for map loading and markers
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Get valid coordinates for markers
  const getValidCoordinates = (lat: number | undefined, lng: number | undefined, fallback = DEFAULT_DUMP_LOCATION) => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
    return fallback;
  };

  // Calculate map center based on available points
  const getMapCenter = useCallback(() => {
    if (!selectedDelivery) return DEFAULT_DUMP_LOCATION;

    const validPoints = [
      getValidCoordinates(selectedDelivery.truck.latitude, selectedDelivery.truck.longitude),
      ...selectedDelivery.garbage
        .map(item => getValidCoordinates(item.garbageId?.binId?.latitude, item.garbageId?.binId?.longitude))
        .filter(coord => coord !== DEFAULT_DUMP_LOCATION),
      DEFAULT_DUMP_LOCATION
    ];

    if (validPoints.length === 0) return DEFAULT_DUMP_LOCATION;

    // Calculate average of all points
    const avgLat = validPoints.reduce((sum, point) => sum + point.lat, 0) / validPoints.length;
    const avgLng = validPoints.reduce((sum, point) => sum + point.lng, 0) / validPoints.length;

    return { lat: avgLat, lng: avgLng };
  }, [selectedDelivery]);

  return (
    <Stack>
      <Box
        sx={{
          padding: theme.spacing(2),
          boxShadow: 2,
          marginY: 2,
          borderRadius: 1,
          overflowX: "hidden",
        }}
      >
        <PageTitle title={`Daily Collection`} />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>

      {/* Jobs List */}
      <Box sx={{ padding: theme.spacing(2) }}>
        {isDeliveryDataFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Available Collection Jobs
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Collection ID</TableCell>
                    <TableCell>Truck</TableCell>
                    <TableCell>Driver Location</TableCell>
                    <TableCell>Bins Count</TableCell>
                    <TableCell>Total Weight</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((delivery: DeliveryData) => (
                    <TableRow key={delivery._id}>
                      <TableCell>{delivery._id.slice(-8)}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {delivery.truck.truckId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Capacity: {delivery.truck.capacity}kg
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 200 }}>
                          {delivery.truck.currentLocation}
                        </Typography>
                      </TableCell>
                      <TableCell>{delivery.garbage.length}</TableCell>
                      <TableCell>
                        {delivery.garbage.reduce(
                          (total, item) => total + item.garbageId.wasteWeight,
                          0
                        )}
                        kg
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={delivery.deliveryStatus}
                          color={
                            delivery.deliveryStatus === "Pending"
                              ? "warning"
                              : "success"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <CustomButton
                          variant="contained"
                          size="small"
                          onClick={() => handleAcceptJob(delivery)}
                          disabled={delivery.deliveryStatus !== "Pending"}
                        >
                          Accept Job
                        </CustomButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={7}
                      count={deliveryData?.length || 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>

      {/* Accepted Jobs Section */}
      <Box sx={{ padding: theme.spacing(2), mt: 2 }}>
        {isInProgressDataFetching ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <LinearProgress sx={{ width: "100%" }} />
          </Box>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: "success.main" }}>
              Accepted Jobs (In Progress)
            </Typography>
            
            {inProgressData && inProgressData.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Collection ID</TableCell>
                      <TableCell>Truck</TableCell>
                      <TableCell>Driver Location</TableCell>
                      <TableCell>Bins Count</TableCell>
                      <TableCell>Total Weight</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inProgressData.map((delivery: DeliveryData) => (
                      <TableRow key={delivery._id}>
                        <TableCell>{delivery._id.slice(-8)}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {delivery.truck.truckId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Capacity: {delivery.truck.capacity}kg
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {delivery.truck.currentLocation}
                          </Typography>
                        </TableCell>
                        <TableCell>{delivery.garbage.length}</TableCell>
                        <TableCell>
                          {delivery.garbage.reduce(
                            (total, item) => total + item.garbageId.wasteWeight,
                            0
                          )}
                          kg
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={delivery.deliveryStatus}
                            color="info"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <CustomButton
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              setShowRouteMap(true);
                            }}
                          >
                            View Route
                          </CustomButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No accepted jobs in progress
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Job Confirmation Dialog */}
      <Dialog
        open={showJobDetails}
        onClose={() => setShowJobDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <AssignmentIcon />
            Confirm Job Assignment
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDelivery && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <TruckIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Truck Details
                    </Typography>
                    <Typography>
                      <strong>Truck ID:</strong>{" "}
                      {selectedDelivery.truck.truckId}
                    </Typography>
                    <Typography>
                      <strong>Capacity:</strong>{" "}
                      {selectedDelivery.truck.capacity}kg
                    </Typography>
                    <Typography>
                      <strong>Current Location:</strong>{" "}
                      {selectedDelivery.truck.currentLocation}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong> {selectedDelivery.truck.status}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <WasteIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Collection Summary
                    </Typography>
                    <Typography>
                      <strong>Total Bins:</strong>{" "}
                      {selectedDelivery.garbage.length}
                    </Typography>
                    <Typography>
                      <strong>Total Weight:</strong>{" "}
                      {selectedDelivery.garbage.reduce(
                        (total, item) => total + item.garbageId.wasteWeight,
                        0
                      )}
                      kg
                    </Typography>
                    <Typography>
                      <strong>Total Price:</strong> LKR{" "}
                      {selectedDelivery.garbage.reduce(
                        (total, item) => total + item.price,
                        0
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Collection Points
                </Typography>
                <List>
                  {selectedDelivery.garbage.map((item, index) => (
                    <ListItem key={item._id} divider>
                      <ListItemIcon>
                        <LocationOnIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${item.garbageId.binId.binId} - ${item.garbageId.binId.location}`}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Weight: {item.garbageId.wasteWeight}kg | Category:{" "}
                              {item.garbageId.garbageCategory}
                            </Typography>
                            <Typography variant="body2">
                              Owner: {item.garbageId.createdBy.username} |
                              Price: LKR {item.price}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJobDetails(false)}>Cancel</Button>
          <CustomButton
            variant="contained"
            onClick={confirmAcceptJob}
            disabled={acceptJobMutation.isPending}
          >
            {acceptJobMutation.isPending ? "Accepting..." : "Accept Job"}
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Route Map Dialog */}
      <Dialog
        open={showRouteMap}
        onClose={() => setShowRouteMap(false)}
        maxWidth="lg"
        fullWidth
        sx={{ '& .MuiDialog-paper': { maxHeight: '90vh' } }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOnIcon />
            Collection Route
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedDelivery && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {loadError && (
                  <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
                    <Typography>
                      Error loading maps: {loadError.message}
                    </Typography>
                  </Box>
                )}
                {!isLoaded && !loadError && (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <LinearProgress sx={{ width: '100%', mb: 2 }} />
                    <Typography>Loading map...</Typography>
                  </Box>
                )}
                {isLoaded && !loadError && (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={getMapCenter()}
                    zoom={12}
                    onLoad={onMapLoad}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {/* Truck marker */}
                    <MarkerF
                      position={getValidCoordinates(
                        selectedDelivery.truck.latitude,
                        selectedDelivery.truck.longitude,
                        DEFAULT_DUMP_LOCATION
                      )}
                      title={`Truck: ${selectedDelivery.truck.truckId}`}
                      onClick={() => setSelectedMarker("truck")}
                    />

                    {/* Bin markers */}
                    {selectedDelivery.garbage.map((item) => {
                      const isCompleted = completedBins.has(item.garbageId._id);
                      const position = getValidCoordinates(
                        item.garbageId?.binId?.latitude,
                        item.garbageId?.binId?.longitude
                      );

                      return (
                        <MarkerF
                          key={item._id}
                          position={position}
                          title={`Bin: ${item.garbageId?.binId?.binId} - ${isCompleted ? 'Completed' : 'Pending'}`}
                          onClick={() => setSelectedMarker(item._id)}
                          icon={isCompleted ? 
                            { url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" } :
                            { url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }
                          }
                        />
                      );
                    })}

                    {/* Dump location marker */}
                    <MarkerF
                      position={DEFAULT_DUMP_LOCATION}
                      title="Dump Location"
                      onClick={() => setSelectedMarker("dump")}
                      icon={{ url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                    />

                    {/* Info Windows for markers */}
                    {selectedMarker && (
                      <InfoWindow
                        position={
                          selectedMarker === "truck" 
                            ? getValidCoordinates(selectedDelivery.truck.latitude, selectedDelivery.truck.longitude)
                            : selectedMarker === "dump"
                            ? DEFAULT_DUMP_LOCATION
                            : getValidCoordinates(
                                selectedDelivery.garbage.find(g => g._id === selectedMarker)?.garbageId?.binId?.latitude,
                                selectedDelivery.garbage.find(g => g._id === selectedMarker)?.garbageId?.binId?.longitude
                              )
                        }
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div>
                          {selectedMarker === "truck" && (
                            <div>
                              <strong>Truck</strong>
                              <br />
                              ID: {selectedDelivery.truck.truckId}
                              <br />
                              Status: {selectedDelivery.truck.status}
                            </div>
                          )}
                          {selectedMarker === "dump" && (
                            <div>
                              <strong>Dump Location</strong>
                              <br />
                              Final destination
                            </div>
                          )}
                          {selectedMarker !== "truck" && selectedMarker !== "dump" && (
                            (() => {
                              const garbageItem = selectedDelivery.garbage.find(g => g._id === selectedMarker);
                              const isCompleted = completedBins.has(garbageItem?.garbageId._id || '');
                              return (
                                <div>
                                  <strong>Bin {garbageItem?.garbageId.binId.binId}</strong>
                                  <br />
                                  Status: {isCompleted ? 'Completed' : 'Pending'}
                                  <br />
                                  Weight: {garbageItem?.garbageId.wasteWeight}kg
                                </div>
                              );
                            })()
                          )}
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Collection Points
                </Typography>
                <List>
                  {selectedDelivery.garbage.map((item) => {
                    const isCompleted = completedBins.has(item.garbageId._id);
                    return (
                      <ListItem key={item._id} divider>
                        <ListItemIcon>
                          {isCompleted ? (
                            <CheckIcon color="success" />
                          ) : (
                            <LocationOnIcon color="warning" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={`${item.garbageId.binId.binId} - ${item.garbageId.binId.location}`}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Weight: {item.garbageId.wasteWeight}kg |
                                Category: {item.garbageId.garbageCategory}
                              </Typography>
                              <Typography variant="body2">
                                Owner: {item.garbageId.createdBy.username} (
                                {item.garbageId.createdBy.mobile})
                              </Typography>
                            </Box>
                          }
                        />
                        <Box sx={{ ml: 2 }}>
                          {!isCompleted ? (
                            <CustomButton
                              variant="contained"
                              size="small"
                              onClick={() =>
                                handleCompleteBinCollection(item.garbageId._id)
                              }
                              disabled={completeCollectionMutation.isPending}
                            >
                              Complete
                            </CustomButton>
                          ) : (
                            <Chip
                              label="Completed"
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>

              {allBinsCompleted && (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      bgcolor: "success.light",
                      color: "success.contrastText",
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <CheckIcon />
                          <Typography variant="h6">
                            All bins collected!
                          </Typography>
                        </Box>
                        <CustomButton
                          variant="contained"
                          color="success"
                          onClick={handleCompleteDelivery}
                          disabled={completeDeliveryMutation.isPending}
                        >
                          {completeDeliveryMutation.isPending
                            ? "Completing..."
                            : "Complete Delivery"}
                        </CustomButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRouteMap(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default DailyCollection;