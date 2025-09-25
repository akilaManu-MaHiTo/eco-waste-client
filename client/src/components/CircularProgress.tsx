import * as React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function ColoredCircularProgressWithLabel(
  props: CircularProgressProps & {
    value: number;
    size?: number;
    textSize?: number;
    textLabel?: string;
    customColor?: string; // New prop for progress color
  }
) {
  const {
    value,
    size = 40,
    textSize = 12,
    textLabel,
    customColor = "var(--pallet-blue)", // Default color if not provided
  } = props;

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        sx={{
          color: "lightgray",
        }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        sx={{
          color: value > 0 ? customColor : "transparent", // Use provided color
          position: "absolute",
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="overline"
          component="div"
          sx={{
            color: "text.secondary",
            whiteSpace: "nowrap",
            fontSize: `${textSize}px`,
          }}
        >
          {`${Math.round(value)}%`}
        </Typography>
        <Typography>{textLabel}</Typography>
      </Box>
    </Box>
  );
}

export default ColoredCircularProgressWithLabel;
