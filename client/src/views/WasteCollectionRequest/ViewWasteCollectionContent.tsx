import { Alert, Box, Stack } from "@mui/material";
import useIsMobile from "../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import useCurrentUser from "../../hooks/useCurrentUser";
import { GarbageRequest } from "../../api/garbageRequestApi";
import {
  GoogleMap,
  Marker,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";

function ViewGarbageContent({
  garbageCollection,
}: {
  garbageCollection: GarbageRequest;
}) {
  const { isTablet } = useIsMobile();
  const { user } = useCurrentUser();
  const latitude = garbageCollection?.garbageId?.binId?.latitude;
  const longitude = garbageCollection?.garbageId?.binId?.longitude;

  console.log("Garbage", latitude, longitude);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const mapCenter = {
    lat: latitude || 6.9271,
    lng: longitude || 79.8612,
  };

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          flex: 1,
          p: 2,
        }}
      >
        <DrawerContentItem
          label="Reference Number"
          value={garbageCollection?._id}
        />
        <DrawerContentItem
          label="Garbage Bin ID"
          value={garbageCollection?.garbageId?.binId?.binId}
        />
        <DrawerContentItem
          label="Garbage Bin Category"
          value={garbageCollection?.garbageId?.binId?.binType}
        />
        <DrawerContentItem
          label="Garbage Weight"
          value={(garbageCollection.price / 100).toFixed(2) + " kg"}
        />

        {isLoaded && latitude && longitude ? (
          <Box sx={{ mt: 2, height: 300, borderRadius: 2, overflow: "hidden" }}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={{ lat: Number(latitude), lng: Number(longitude) }}
              zoom={15}
            >
              <MarkerF
                position={{ lat: Number(latitude), lng: Number(longitude) }}
              />
            </GoogleMap>
          </Box>
        ) : (
          <Alert sx={{ mt: 2 }} severity="info">
            Location data not available for this garbage bin.
          </Alert>
        )}
      </Box>
    </Stack>
  );
}

export default ViewGarbageContent;
