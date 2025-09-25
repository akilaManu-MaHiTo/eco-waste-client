import { Box, Stack, Typography } from "@mui/material";
import welcome from "../assets/permissionDenied.jpg";

function PermissionDenied() {
  return (
    <Stack>
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 2, mb: 2, fontWeight: "bold", color: "var(--pallet-orange)" }}
      >
        Permission Denied!
      </Typography>
      <Box
        component="img"
        src={welcome}
        alt="Permission Denied"
        sx={{
          height: "auto",
          width: "60vw",
          maxHeight: "55vh",
          objectFit: "contain",
          justifySelf: "center",
          alignSelf: "center",
        }}
      />
      <Typography
        variant="body1"
        align="center"
        sx={{ mt: 2, color: "var(--pallet-green)" }}
      >
        You do not have permission to access this page. Please contact your
        administrator for more information.
      </Typography>
    </Stack>
  );
}

export default PermissionDenied;
