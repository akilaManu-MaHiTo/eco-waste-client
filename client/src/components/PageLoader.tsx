import { Backdrop, CircularProgress } from "@mui/material";
import theme from "../theme";

export default function PageLoader() {
  return (
    <Backdrop
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
      }}
      open={true}
    >
      <CircularProgress sx={{ color: "#67C090" }} size={"3rem"} />
    </Backdrop>
  );
}
