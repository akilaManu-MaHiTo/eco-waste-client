import React, { useMemo, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";

interface CollectionRouteModalProps {
  open: boolean;
  handleClose: () => void;
  selectedRowsData: any[];
  startLocation?: { lat: number; lng: number };
}

const MemoizedDirectionsRenderer = React.memo(DirectionsRenderer);
const MemoizedMarkerF = React.memo(MarkerF);

const DEFAULT_START_LOCATION = { lat: 6.9271, lng: 79.8612 };

const CollectionRouteModal: React.FC<CollectionRouteModalProps> = ({
  open,
  handleClose,
  selectedRowsData,
  startLocation = DEFAULT_START_LOCATION,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const startLat = startLocation.lat;
  const startLng = startLocation.lng;

  const waypoints = useMemo(() => {
    return selectedRowsData.map((row) => ({
      location: {
        lat: row.garbageId.binId.latitude,
        lng: row.garbageId.binId.longitude,
      },
      stopover: true,
    }));
  }, [selectedRowsData]);

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

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
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
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={mapCenter}
            zoom={12}
            options={mapOptions}
          >
            <MemoizedMarkerF
              position={{ lat: startLat, lng: startLng }}
              label="Start"
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
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CollectionRouteModal);
