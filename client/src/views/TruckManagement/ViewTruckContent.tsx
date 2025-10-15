import { Box, Stack } from "@mui/material";
import { format } from "date-fns";
import useIsMobile from "../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { WasteBin } from "../../api/wasteBin";
import { Truck } from "../../api/truck";

function ViewGarbageContent({ truck }: { truck: Truck }) {
  const { isTablet } = useIsMobile();
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
        }}
      >
        <DrawerContentItem
          label="Reference Number"
          value={truck?._id}
          sx={{ flex: 1 }}
        />
        {/* <DrawerContentItem
          label="Requested Date"
          value={
            medicalRequest.created_at
              ? format(medicalRequest.created_at, "dd/MM/yyyy hh:mm a")
              : "--"
          }
          sx={{ flex: 1 }}
        /> */}
        <DrawerContentItem
          label="Truck ID"
          value={truck?.truckId}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Capacity (Kg)"
          value={truck?.capacity + "Kg"}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Status"
          value={truck?.status}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewGarbageContent;