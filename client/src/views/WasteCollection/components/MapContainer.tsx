import { Box, LinearProgress, Typography } from "@mui/material";
import { GoogleMap, MarkerF, DirectionsRenderer, InfoWindow } from "@react-google-maps/api";

interface MapContainerProps {
  isLoaded: boolean;
  loadError: Error | undefined;
  center: google.maps.LatLngLiteral;
  zoom: number;
  onLoad?: (map: google.maps.Map) => void;
  directions?: google.maps.DirectionsResult | null;
  children?: React.ReactNode;
  height?: string | number;
  options?: google.maps.MapOptions;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  isLoaded,
  loadError,
  center,
  zoom,
  onLoad,
  directions,
  children,
  height = 400,
  options = {},
}) => {
  if (loadError) {
    return (
      <Box
        sx={{
          height,
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
    );
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <LinearProgress sx={{ width: "60%" }} />
        <Typography color="text.secondary">Loading map...</Typography>
      </Box>
    );
  }

  const defaultOptions: google.maps.MapOptions = {
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
    ...options,
  };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      options={defaultOptions}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
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
      {children}
    </GoogleMap>
  );
};
