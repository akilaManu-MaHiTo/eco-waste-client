import { Theme, useMediaQuery } from "@mui/material";

function useIsMobile() {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return { isMobile, isTablet };
}

export default useIsMobile;
