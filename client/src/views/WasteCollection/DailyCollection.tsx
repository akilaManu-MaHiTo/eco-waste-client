import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  TablePagination,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Delete as WasteIcon } from "@mui/icons-material";
import { useLoadScript } from "@react-google-maps/api";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import {
  ActiveJobCard,
  JobCard,
  JobConfirmationDialog,
  RouteMapDialog,
} from "./components";

const DEFAULT_DUMP_LOCATION = { lat: 6.9271, lng: 79.8612 };
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

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
          <ActiveJobCard
            activeJob={activeJob}
            completedBins={completedBins}
            isLoaded={isLoaded}
            loadError={loadError}
            directions={directionsActive}
            mapCenter={getMapCenter(activeJob)}
            dumpLocation={DEFAULT_DUMP_LOCATION}
            onViewDetails={() => {
              setSelectedDelivery(activeJob);
              setShowRouteMap(true);
            }}
            onCompleteBin={handleCompleteBinCollection}
            onCompleteDelivery={handleCompleteDelivery}
            isCompletionPending={completeCollectionMutation.isPending}
            isDeliveryPending={completeDeliveryMutation.isPending}
            getValidCoordinates={getValidCoordinates}
          />
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
                      <JobCard
                        truckId={delivery.truck.truckId}
                        jobId={delivery._id.slice(-8)}
                        status={delivery.deliveryStatus}
                        location={delivery.truck.currentLocation}
                        binCount={delivery.garbage.length}
                        totalWeight={delivery.garbage.reduce(
                          (total, item) => total + item.garbageId.wasteWeight,
                          0
                        )}
                        progress={`${completedBins.size}/${delivery.garbage.length} bins`}
                        showProgress={true}
                        onAction={() => {
                          setSelectedDelivery(delivery);
                          setShowRouteMap(true);
                        }}
                        actionLabel={index === 0 ? "View Details" : "View Route"}
                        actionVariant={index === 0 ? "contained" : "outlined"}
                        isActive={index === 0}
                      />
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
                      <JobCard
                        truckId={delivery.truck.truckId}
                        jobId={delivery._id.slice(-8)}
                        status={delivery.deliveryStatus}
                        capacity={delivery.truck.capacity}
                        binCount={delivery.garbage.length}
                        totalWeight={delivery.garbage.reduce(
                          (total, item) => total + item.garbageId.wasteWeight,
                          0
                        )}
                        onAction={() => handleAcceptJob(delivery)}
                        actionLabel="Accept Job"
                        disabled={delivery.deliveryStatus !== "Pending"}
                      />
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
      <JobConfirmationDialog
        open={showJobDetails}
        delivery={selectedDelivery}
        onClose={() => setShowJobDetails(false)}
        onConfirm={confirmAcceptJob}
        isPending={acceptJobMutation.isPending}
      />

      {/* Route Map Dialog */}
      <RouteMapDialog
        open={showRouteMap}
        delivery={selectedDelivery}
        completedBins={completedBins}
        isLoaded={isLoaded}
        loadError={loadError}
        directions={directionsSelected}
        mapCenter={getMapCenter()}
        dumpLocation={DEFAULT_DUMP_LOCATION}
        selectedMarker={selectedMarker}
        onClose={() => setShowRouteMap(false)}
        onMapLoad={onMapLoad}
        onMarkerClick={setSelectedMarker}
        onCloseMarker={() => setSelectedMarker(null)}
        onCompleteBin={handleCompleteBinCollection}
        onCompleteDelivery={handleCompleteDelivery}
        isCompletionPending={completeCollectionMutation.isPending}
        isDeliveryPending={completeDeliveryMutation.isPending}
        getValidCoordinates={getValidCoordinates}
      />
    </Box>
  );
}

export default DailyCollection;
