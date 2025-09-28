import { Box, Stack } from "@mui/material";
import { format } from "date-fns";
import useIsMobile from "../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { WasteBin } from "../../api/wasteBin";

function ViewGarbageContent({ wasteBin }: { wasteBin: WasteBin }) {
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
          value={wasteBin?.binId}
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
          label="Waste Bin ID"
          value={wasteBin?.binId}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Waste Type"
          value={wasteBin?.binType}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Threshold Level (L)"
          value={wasteBin?.thresholdLevel + "L"}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewGarbageContent;
