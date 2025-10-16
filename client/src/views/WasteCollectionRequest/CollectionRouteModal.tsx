import React, { useMemo, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  CircularProgress,
  Autocomplete,
  TextField,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import CustomButton from "../../components/CustomButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGarbageCollectionRoute } from "../../api/garbageRequestApi";
import queryClient from "../../state/queryClient";
import { enqueueSnackbar } from "notistack";
import { fetchTrucks } from "../../api/truck";

interface CollectionRouteModalProps {
  open: boolean;
  handleClose: () => void;
  selectedRowsData: any[];
}

const MemoizedDirectionsRenderer = React.memo(DirectionsRenderer);
const MemoizedMarkerF = React.memo(MarkerF);

const DEFAULT_START_LOCATION = { lat: 6.9271, lng: 79.8612 };

const CollectionRouteModal: React.FC<CollectionRouteModalProps> = ({
  open,
  handleClose,
  selectedRowsData,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const { data: truckData = [], isFetching: isTruckDataFetching } = useQuery({
    queryKey: ["trucks"],
    queryFn: fetchTrucks,
  });

  const [selectedTruck, setSelectedTruck] = useState<any | null>(null);
  const startLat = selectedTruck?.latitude ?? DEFAULT_START_LOCATION.lat;
  const startLng = selectedTruck?.longitude ?? DEFAULT_START_LOCATION.lng;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const waypoints = useMemo(
    () =>
      selectedRowsData.map((row) => ({
        location: {
          lat: row.garbageId.binId.latitude,
          lng: row.garbageId.binId.longitude,
        },
        stopover: true,
      })),
    [selectedRowsData]
  );

  const waypointsKey = useMemo(
    () => waypoints.map((w) => `${w.location.lat},${w.location.lng}`).join(";"),
    [waypoints]
  );

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!open || !isLoaded || waypoints.length === 0) {
      setDirections(null);
      return;
    }

    let cancelled = false;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: startLat, lng: startLng },
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (!cancelled) {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            setDirections(null);
          }
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [open, isLoaded, startLat, startLng, waypointsKey]);

  const mapCenter = useMemo(
    () => ({ lat: startLat, lng: startLng }),
    [startLat, startLng]
  );

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
    }),
    []
  );

  const { mutate: createRoute, isPending } = useMutation({
    mutationFn: createGarbageCollectionRoute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["garbageRoutes"] });
      enqueueSnackbar("Collection route created successfully!", {
        variant: "success",
      });
      handleClose();
    },
    onError: () => {
      enqueueSnackbar("Failed to create collection route!", {
        variant: "error",
      });
    },
  });

  const handleCreateRoute = () => {
    if (!selectedTruck) {
      enqueueSnackbar("Please select a truck!", { variant: "warning" });
      return;
    }

    const garbageRequestIds = selectedRowsData.map((row) => row._id);
    createRoute({
      garbage: garbageRequestIds,
      truck: selectedTruck._id,
    });
  };

  if (!isLoaded) return <CircularProgress />;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" fullScreen={isMobile}>
      <DialogTitle>
        Collection Route
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack sx={{ height: "500px", width: "100%" }}>
          <Autocomplete
            size="small"
            loading={isTruckDataFetching}
            value={selectedTruck}
            onChange={(_, newValue) => setSelectedTruck(newValue)}
            options={truckData}
            getOptionLabel={(option) => option.truckId}
            sx={{ flex: 1, margin: "0.5rem" }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Select Truck"
                name="truck"
              />
            )}
          />

          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={12}
            options={mapOptions}
          >
            <MemoizedMarkerF
              position={{ lat: startLat, lng: startLng }}
              label="Truck"
            />
            {selectedRowsData.map((row, idx) => (
              <MemoizedMarkerF
                key={row._id}
                position={{
                  lat: row.garbageId.binId.latitude,
                  lng: row.garbageId.binId.longitude,
                }}
                label={`${idx + 1}`}
              />
            ))}
            {directions && (
              <MemoizedDirectionsRenderer
                directions={directions}
                options={{
                  preserveViewport: true,
                }}
              />
            )}
          </GoogleMap>

          <CustomButton
            onClick={handleCreateRoute}
            disabled={isPending || !selectedTruck}
            variant="contained"
            sx={{ mt: 2 }}
          >
            {isPending ? "Creating..." : "Create Route"}
          </CustomButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CollectionRouteModal);
