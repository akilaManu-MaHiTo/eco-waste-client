import { Box, Stack } from "@mui/material";
import { format } from "date-fns";
import useIsMobile from "../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { Garbage } from "../../api/garbage";

function ViewMedicineRequestContent({ garbage }: { garbage: Garbage }) {
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
          value={garbage?._id}
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
          label="Garbage Bin ID"
          value={garbage?.garbageId}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Garbage Category"
          value={garbage?.garbageCategory}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Garbage Weight"
          value={garbage?.wasteWeight + "kg"}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewMedicineRequestContent;
