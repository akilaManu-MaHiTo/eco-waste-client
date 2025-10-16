import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
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
} from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  LocalShipping as TruckIcon,
  Delete as WasteIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import {
  GoogleMap,
  InfoWindow,
  useLoadScript,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";

import { PermissionKeys } from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import CustomButton from "../../components/CustomButton";
import {
  updateTruckAvailable,
  updateTruckInService,
  updateTruckWasteLoad,
} from "../../api/truck.ts";
import {
  fetchAllPendingRequests,
  fetchAllInProgressRequests,
} from "../../api/garbageRequestApi.ts";
import { Delivery } from "../../api/delivery.ts";

// Types for the delivery data


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
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [completedBins, setCompletedBins] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsActive, setDirectionsActive] =
    useState<google.maps.DirectionsResult | null>(null);
  const [directionsSelected, setDirectionsSelected] =
    useState<google.maps.DirectionsResult | null>(null);

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

  const handleAcceptJob = (delivery: Delivery) => {
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
  const getValidCoordinates = (
    lat: number | undefined,
    lng: number | undefined,
    fallback = DEFAULT_DUMP_LOCATION
  ) => {
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
    return fallback;
  };

  // Calculate map center based on available points
  const getMapCenter = useCallback(
    (delivery?: Delivery) => {
      const targetDelivery = delivery || selectedDelivery;
      if (!targetDelivery) return DEFAULT_DUMP_LOCATION;

      const validPoints = [
        getValidCoordinates(
          targetDelivery.truck.latitude,
          targetDelivery.truck.longitude
        ),
        ...targetDelivery.garbage
          .map((item) =>
            getValidCoordinates(
              item.garbageId?.binId?.latitude,
              item.garbageId?.binId?.longitude
            )
          )
          .filter((coord) => coord !== DEFAULT_DUMP_LOCATION),
        DEFAULT_DUMP_LOCATION,
      ];

      if (validPoints.length === 0) return DEFAULT_DUMP_LOCATION;

      // Calculate average of all points
      const avgLat =
        validPoints.reduce((sum, point) => sum + point.lat, 0) /
        validPoints.length;
      const avgLng =
        validPoints.reduce((sum, point) => sum + point.lng, 0) /
        validPoints.length;

      return { lat: avgLat, lng: avgLng };
    },
    [selectedDelivery]
  );

  // Get the first active job for main display
  const activeJob =
    inProgressData && inProgressData.length > 0 ? inProgressData[0] : null;

  // Auto-set the active job as selected delivery for completion tracking
  useEffect(() => {
    if (activeJob && !selectedDelivery) {
      setSelectedDelivery(activeJob);
    }
  }, [activeJob, selectedDelivery]);

  // Build a route request from truck -> bins -> dump
  const buildRouteRequest = useCallback(
    (delivery: Delivery): google.maps.DirectionsRequest | null => {
      if (!delivery) return null;

      const origin = getValidCoordinates(
        delivery.truck.latitude,
        delivery.truck.longitude,
        DEFAULT_DUMP_LOCATION
      );

      const destination = DEFAULT_DUMP_LOCATION;

      const waypoints: google.maps.DirectionsWaypoint[] = delivery.garbage
        .map((item) =>
          getValidCoordinates(
            item.garbageId?.binId?.latitude,
            item.garbageId?.binId?.longitude,
            // Don't inject fallback here as a waypoint unless valid
            undefined as unknown as google.maps.LatLngLiteral
          )
        )
        .filter(
          (coord): coord is google.maps.LatLngLiteral =>
            !!coord &&
            typeof coord.lat === "number" &&
            typeof coord.lng === "number" &&
            !isNaN(coord.lat) &&
            !isNaN(coord.lng)
        )
        .map((coord) => ({ location: coord, stopover: true }));

      // Ensure we have a valid origin and destination
      if (
        !origin ||
        typeof origin.lat !== "number" ||
        typeof origin.lng !== "number" ||
        isNaN(origin.lat) ||
        isNaN(origin.lng)
      )
        return null;

      if (
        !destination ||
        typeof destination.lat !== "number" ||
        typeof destination.lng !== "number" ||
        isNaN(destination.lat) ||
        isNaN(destination.lng)
      )
        return null;

      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoints.length ? waypoints : undefined,
        optimizeWaypoints: true,
        provideRouteAlternatives: false,
      };
      return request;
    },
    []
  );

  // Compute route for the small Active Job map
  useEffect(() => {
    if (!isLoaded) {
      setDirectionsActive(null);
      return;
    }
    if (!activeJob) {
      setDirectionsActive(null);
      return;
    }
    const req = buildRouteRequest(activeJob);
    if (!req) {
      setDirectionsActive(null);
      return;
    }
    const svc = new google.maps.DirectionsService();
    svc.route(req, (res, status) => {
      if (status === "OK" && res) {
        setDirectionsActive(res);
      } else {
        setDirectionsActive(null);
      }
    });
  }, [isLoaded, activeJob, buildRouteRequest]);

  // Compute route for the Selected Delivery (dialog map) and fit bounds
  useEffect(() => {
    if (!isLoaded) {
      setDirectionsSelected(null);
      return;
    }
    if (!selectedDelivery) {
      setDirectionsSelected(null);
      return;
    }
    const req = buildRouteRequest(selectedDelivery);
    if (!req) {
      setDirectionsSelected(null);
      return;
    }
    const svc = new google.maps.DirectionsService();
    svc.route(req, (res, status) => {
      if (status === "OK" && res) {
        setDirectionsSelected(res);
        // Fit to route in dialog map
        try {
          if (map && res.routes && res.routes[0]) {
            const bounds = new google.maps.LatLngBounds();
            const path = res.routes[0].overview_path;
            if (path && path.length) {
              path.forEach((p) => bounds.extend(p));
              map.fitBounds(bounds);
            }
          }
        } catch (e) {
          // ignore fit error
        }
      } else {
        setDirectionsSelected(null);
      }
    });
  }, [isLoaded, selectedDelivery, map, buildRouteRequest]);

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          padding: theme.spacing(3),
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <PageTitle title="Daily Collection" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>

      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3, py: 4 }}>
        {/* Active Job Dashboard */}
        {activeJob && (
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
                      <Card
                        sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}
                      >
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            variant="h4"
                            color="primary"
                            fontWeight="bold"
                          >
                            {completedBins.size}/{activeJob.garbage.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Bins Completed
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              (completedBins.size / activeJob.garbage.length) *
                              100
                            }
                            sx={{ mt: 1, borderRadius: 1, height: 6 }}
                          />
                        </CardContent>
                      </Card>

                      <Card
                        sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}
                      >
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            variant="h4"
                            color="warning.main"
                            fontWeight="bold"
                          >
                            {activeJob.garbage.reduce(
                              (total, item) =>
                                total + item.garbageId.wasteWeight,
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
                        onClick={() => {
                          setSelectedDelivery(activeJob);
                          setShowRouteMap(true);
                        }}
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
                    <Card
                      sx={{ borderRadius: 2, overflow: "hidden", height: 300 }}
                    >
                      {loadError && (
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Typography color="error" variant="h6">
                            Map Unavailable
                          </Typography>
                          <Typography color="text.secondary">
                            {loadError.message}
                          </Typography>
                        </Box>
                      )}
                      {!isLoaded && !loadError && (
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <LinearProgress sx={{ width: "60%" }} />
                          <Typography color="text.secondary">
                            Loading map...
                          </Typography>
                        </Box>
                      )}
                      {isLoaded && !loadError && (
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          center={getMapCenter(activeJob)}
                          zoom={13}
                          options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            zoomControl: true,
                            styles: [
                              {
                                featureType: "all",
                                elementType: "geometry.fill",
                                stylers: [{ saturation: -20 }],
                              },
                            ],
                          }}
                        >
                          {directionsActive && (
                            <DirectionsRenderer
                              directions={directionsActive}
                              options={{
                                suppressMarkers: true,
                                polylineOptions: {
                                  strokeColor: "#1976d2",
                                  strokeOpacity: 0.9,
                                  strokeWeight: 5,
                                },
                              }}
                            />
                          )}
                          <MarkerF
                            position={getValidCoordinates(
                              activeJob.truck.latitude,
                              activeJob.truck.longitude,
                              DEFAULT_DUMP_LOCATION
                            )}
                            title={`Truck: ${activeJob.truck.truckId}`}
                            icon={{
                              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                            }}
                          />

                          {activeJob.garbage.map((item) => {
                            const isCompleted = completedBins.has(
                              item.garbageId._id
                            );
                            const position = getValidCoordinates(
                              item.garbageId?.binId?.latitude,
                              item.garbageId?.binId?.longitude
                            );

                            return (
                              <MarkerF
                                key={item._id}
                                position={position}
                                title={`Bin: ${
                                  item.garbageId?.binId?.binId
                                } - ${isCompleted ? "Completed" : "Pending"}`}
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
                            position={DEFAULT_DUMP_LOCATION}
                            title="Dump Location"
                            icon={{
                              url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                            }}
                          />
                        </GoogleMap>
                      )}
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
                            const isCompleted = completedBins.has(
                              item.garbageId._id
                            );
                            return (
                              <Grid item xs={12} sm={6} md={4} key={item._id}>
                                <Card
                                  sx={{
                                    borderRadius: 2,
                                    border: isCompleted
                                      ? "2px solid #4caf50"
                                      : "1px solid #e0e0e0",
                                    bgcolor: isCompleted ? "#f8fff8" : "white",
                                    transition: "all 0.2s",
                                  }}
                                >
                                  <CardContent sx={{ p: 2 }}>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="space-between"
                                      mb={1}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        fontWeight="bold"
                                      >
                                        {item.garbageId.binId.binId}
                                      </Typography>
                                      {isCompleted ? (
                                        <CheckIcon color="success" />
                                      ) : (
                                        <ScheduleIcon color="warning" />
                                      )}
                                    </Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mb: 1 }}
                                    >
                                      {item.garbageId.binId.location}
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
                                      {item.garbageId.wasteWeight}kg •{" "}
                                      {item.garbageId.garbageCategory}
                                    </Typography>

                                    {!isCompleted ? (
                                      <CustomButton
                                        variant="contained"
                                        size="small"
                                        onClick={() =>
                                          handleCompleteBinCollection(
                                            item.garbageId._id
                                          )
                                        }
                                        disabled={
                                          completeCollectionMutation.isPending
                                        }
                                        sx={{ borderRadius: 2 }}
                                        fullWidth
                                      >
                                        Mark Complete
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
                              </Grid>
                            );
                          })}
                        </Grid>

                        {activeJob.garbage.every((item) =>
                          completedBins.has(item.garbageId._id)
                        ) && (
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
                                  <CheckIcon
                                    color="success"
                                    sx={{ fontSize: 32 }}
                                  />
                                  <Box>
                                    <Typography
                                      variant="h6"
                                      color="success.dark"
                                      fontWeight="bold"
                                    >
                                      All Collections Complete!
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="success.dark"
                                    >
                                      Ready to complete delivery to dump
                                      location
                                    </Typography>
                                  </Box>
                                </Box>
                                <CustomButton
                                  variant="contained"
                                  color="success"
                                  size="large"
                                  onClick={handleCompleteDelivery}
                                  disabled={completeDeliveryMutation.isPending}
                                  sx={{ borderRadius: 2, px: 4 }}
                                >
                                  {completeDeliveryMutation.isPending
                                    ? "Completing..."
                                    : "Complete Delivery"}
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
        )}

        {/* All Active Jobs */}
        {inProgressData && inProgressData.length > 0 && (
          <Card sx={{ mb: 4, borderRadius: 3, border: "1px solid #e0e0e0" }}>
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  bgcolor: "#f8f9fa",
                  p: 3,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  All Active Jobs ({inProgressData.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor all ongoing collection tasks
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  {inProgressData.map((delivery: Delivery, index) => (
                    <Grid item xs={12} md={6} lg={4} key={delivery._id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          border:
                            index === 0
                              ? "2px solid #4caf50"
                              : "1px solid #e0e0e0",
                          bgcolor: index === 0 ? "#f8fff8" : "white",
                          transition: "all 0.2s",
                          "&:hover": { boxShadow: 3 },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="between"
                            mb={2}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {delivery.truck.truckId}
                            </Typography>
                            {index === 0 && (
                              <Chip
                                label="ACTIVE"
                                color="success"
                                size="small"
                              />
                            )}
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            ID: {delivery._id.slice(-8)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            Location: {delivery.truck.currentLocation}
                          </Typography>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              Progress: {completedBins.size}/
                              {delivery.garbage.length} bins
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (completedBins.size / delivery.garbage.length) *
                                100
                              }
                              sx={{ borderRadius: 1, height: 6 }}
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            Weight:{" "}
                            {delivery.garbage.reduce(
                              (total, item) =>
                                total + item.garbageId.wasteWeight,
                              0
                            )}
                            kg
                          </Typography>

                          <CustomButton
                            variant={index === 0 ? "contained" : "outlined"}
                            size="small"
                            onClick={() => {
                              setSelectedDelivery(delivery);
                              setShowRouteMap(true);
                            }}
                            sx={{ borderRadius: 2 }}
                            fullWidth
                          >
                            {index === 0 ? "View Details" : "View Route"}
                          </CustomButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Available Jobs */}
        <Card sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                bgcolor: "#f8f9fa",
                p: 3,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Available Collection Jobs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {deliveryData?.length || 0} jobs waiting for assignment
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              {isDeliveryDataFetching ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <LinearProgress sx={{ width: "60%", mx: "auto", mb: 2 }} />
                  <Typography color="text.secondary">
                    Loading available jobs...
                  </Typography>
                </Box>
              ) : deliveryData && deliveryData.length > 0 ? (
                <Grid container spacing={2}>
                  {paginatedData.map((delivery: Delivery) => (
                    <Grid item xs={12} md={6} lg={4} key={delivery._id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          border: "1px solid #e0e0e0",
                          transition: "all 0.2s",
                          "&:hover": { boxShadow: 3, borderColor: "#2196f3" },
                        }}
                      >
                        <CardContent>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="between"
                            mb={2}
                          >
                            <Typography variant="subtitle1" fontWeight="bold">
                              {delivery.truck.truckId}
                            </Typography>
                            <Chip
                              label={delivery.deliveryStatus}
                              color="warning"
                              size="small"
                            />
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            ID: {delivery._id.slice(-8)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            Capacity: {delivery.truck.capacity}kg
                          </Typography>

                          <Box
                            sx={{
                              bgcolor: "#f5f5f5",
                              p: 2,
                              borderRadius: 1,
                              mb: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="primary"
                            >
                              {delivery.garbage.length}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Collection Points
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            Total Weight:{" "}
                            {delivery.garbage.reduce(
                              (total, item) =>
                                total + item.garbageId.wasteWeight,
                              0
                            )}
                            kg
                          </Typography>

                          <CustomButton
                            variant="contained"
                            size="small"
                            onClick={() => handleAcceptJob(delivery)}
                            disabled={delivery.deliveryStatus !== "Pending"}
                            sx={{ borderRadius: 2 }}
                            fullWidth
                          >
                            Accept Job
                          </CustomButton>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <WasteIcon
                    sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Available Jobs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All collection jobs have been assigned or completed
                  </Typography>
                </Box>
              )}

              {deliveryData && deliveryData.length > rowsPerPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <TablePagination
                    component="div"
                    count={deliveryData?.length || 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[6, 12, 24]}
                  />
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Job Confirmation Dialog */}
      <Dialog
        open={showJobDetails}
        onClose={() => setShowJobDetails(false)}
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
          {selectedDelivery && (
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
                          {selectedDelivery.truck.truckId}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Capacity
                        </Typography>
                        <Typography variant="body1">
                          {selectedDelivery.truck.capacity}kg
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current Location
                        </Typography>
                        <Typography variant="body1">
                          {selectedDelivery.truck.currentLocation}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={selectedDelivery.truck.status}
                          size="small"
                        />
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
                          {selectedDelivery.garbage.length}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Weight
                        </Typography>
                        <Typography variant="body1">
                          {selectedDelivery.garbage.reduce(
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
                          {selectedDelivery.garbage.reduce(
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
                      Collection Points ({selectedDelivery.garbage.length})
                    </Typography>
                    <Grid container spacing={2}>
                      {selectedDelivery.garbage.map((item) => (
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
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
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setShowJobDetails(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <CustomButton
            variant="contained"
            onClick={confirmAcceptJob}
            disabled={acceptJobMutation.isPending}
            sx={{ borderRadius: 2, px: 4 }}
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
          {selectedDelivery && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2, overflow: "hidden", height: 400 }}>
                  {loadError && (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Typography color="error" variant="h6">
                        Map Unavailable
                      </Typography>
                      <Typography color="text.secondary">
                        {loadError.message}
                      </Typography>
                    </Box>
                  )}
                  {!isLoaded && !loadError && (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <LinearProgress sx={{ width: "60%" }} />
                      <Typography color="text.secondary">
                        Loading map...
                      </Typography>
                    </Box>
                  )}
                  {isLoaded && !loadError && (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "100%" }}
                      center={getMapCenter()}
                      zoom={12}
                      onLoad={onMapLoad}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: true,
                      }}
                    >
                      {directionsSelected && (
                        <DirectionsRenderer
                          directions={directionsSelected}
                          options={{
                            suppressMarkers: true,
                            polylineOptions: {
                              strokeColor: "#1976d2",
                              strokeOpacity: 0.9,
                              strokeWeight: 5,
                            },
                          }}
                        />
                      )}
                      <MarkerF
                        position={getValidCoordinates(
                          selectedDelivery.truck.latitude,
                          selectedDelivery.truck.longitude,
                          DEFAULT_DUMP_LOCATION
                        )}
                        title={`Truck: ${selectedDelivery.truck.truckId}`}
                        onClick={() => setSelectedMarker("truck")}
                      />

                      {selectedDelivery.garbage.map((item) => {
                        const isCompleted = completedBins.has(
                          item.garbageId._id
                        );
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
                            onClick={() => setSelectedMarker(item._id)}
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
                        position={DEFAULT_DUMP_LOCATION}
                        title="Dump Location"
                        onClick={() => setSelectedMarker("dump")}
                        icon={{
                          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                        }}
                      />

                      {selectedMarker && (
                        <InfoWindow
                          position={
                            selectedMarker === "truck"
                              ? getValidCoordinates(
                                  selectedDelivery.truck.latitude,
                                  selectedDelivery.truck.longitude
                                )
                              : selectedMarker === "dump"
                              ? DEFAULT_DUMP_LOCATION
                              : getValidCoordinates(
                                  selectedDelivery.garbage.find(
                                    (g) => g._id === selectedMarker
                                  )?.garbageId?.binId?.latitude,
                                  selectedDelivery.garbage.find(
                                    (g) => g._id === selectedMarker
                                  )?.garbageId?.binId?.longitude
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
                            {selectedMarker !== "truck" &&
                              selectedMarker !== "dump" &&
                              (() => {
                                const garbageItem =
                                  selectedDelivery.garbage.find(
                                    (g) => g._id === selectedMarker
                                  );
                                const isCompleted = completedBins.has(
                                  garbageItem?.garbageId._id || ""
                                );
                                return (
                                  <div>
                                    <strong>
                                      Bin {garbageItem?.garbageId.binId.binId}
                                    </strong>
                                    <br />
                                    Status:{" "}
                                    {isCompleted ? "Completed" : "Pending"}
                                    <br />
                                    Weight: {garbageItem?.garbageId.wasteWeight}
                                    kg
                                  </div>
                                );
                              })()}
                          </div>
                        </InfoWindow>
                      )}
                    </GoogleMap>
                  )}
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
                      {selectedDelivery.garbage.map((item) => {
                        const isCompleted = completedBins.has(
                          item.garbageId._id
                        );
                        return (
                          <Grid item xs={12} sm={6} md={4} key={item._id}>
                            <Card
                              sx={{
                                borderRadius: 2,
                                border: isCompleted
                                  ? "2px solid #4caf50"
                                  : "1px solid #e0e0e0",
                                bgcolor: isCompleted ? "#f8fff8" : "white",
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="between"
                                  mb={1}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    fontWeight="bold"
                                  >
                                    {item.garbageId.binId.binId}
                                  </Typography>
                                  {isCompleted ? (
                                    <CheckIcon color="success" />
                                  ) : (
                                    <LocationOnIcon color="warning" />
                                  )}
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 1 }}
                                >
                                  {item.garbageId.binId.location}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Weight: {item.garbageId.wasteWeight}kg |{" "}
                                  {item.garbageId.garbageCategory}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 2 }}
                                >
                                  Owner: {item.garbageId.createdBy.username} (
                                  {item.garbageId.createdBy.mobile})
                                </Typography>

                                {!isCompleted ? (
                                  <CustomButton
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                      handleCompleteBinCollection(
                                        item.garbageId._id
                                      )
                                    }
                                    disabled={
                                      completeCollectionMutation.isPending
                                    }
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
                          onClick={handleCompleteDelivery}
                          disabled={completeDeliveryMutation.isPending}
                          sx={{ borderRadius: 2, px: 4 }}
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

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowRouteMap(false)}
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DailyCollection;
