import { Box, Stack, Typography } from "@mui/material";
import underDevPng from "../assets/underDev.png";

function UnderDevelopment({ pageName }: { pageName: string }) {
  return (
    <Stack>
      <Typography
        variant="h4"
        align="center"
        sx={{ mt: 2, fontWeight: "bold", color: "var(--pallet-orange)" }}
      >
        We are sorry!
      </Typography>
      <Box
        component="img"
        src={underDevPng}
        alt="Under Development"
        sx={{
          height: "auto",
          width: "60vw",
          maxHeight: "50vh",
          objectFit: "contain",
          justifySelf: "center",
          alignSelf: "center",
        }}
      />
      <Typography
        variant="h5"
        align="center"
        sx={{ mt: 1, color: "var(--pallet-green)" }}
      >
        {`${pageName} page is under development`}
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{ mt: 1, color: "var(--pallet-main-blue)" }}
      >
        We are working hard to make this page available soon. Thank you for your
        patience.
      </Typography>
    </Stack>
  );
}

export default UnderDevelopment;
