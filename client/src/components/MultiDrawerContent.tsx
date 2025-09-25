import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

interface DrawerContentItemProps {
  label: string;
  value?: string | string[]; // Removed number type to match expected usage
  isRichText?: boolean;
  sx?: SxProps;
}

export function MultiDrawerContent({
  label,
  value,
  isRichText,
  sx,
}: DrawerContentItemProps) {
  // Parse value if it's a stringified JSON array
  let displayValue: string | string[] = value ?? "--";

  try {
    if (typeof value === "string") {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        displayValue = parsed.map((item) => item.replace(/^"|"$/g, ""));
      }
    }
  } catch (error) {
    console.error("Error parsing value:", error);
  }

  return (
    <Box
      sx={{
        ...sx,
        paddingY: "0.3rem",
        paddingX: "0.5rem",
        minWidth: "8rem",
      }}
    >
      <Typography
        variant="caption"
        sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
      >
        {label}
      </Typography>
      {isRichText ? (
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{
            __html: Array.isArray(displayValue)
              ? displayValue.join("<br/>")
              : String(displayValue),
          }}
        />
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {Array.isArray(displayValue)
            ? displayValue.map((item, index) => <Chip label={item} />)
            : displayValue}
        </Box>
      )}
    </Box>
  );
}

export default MultiDrawerContent;
