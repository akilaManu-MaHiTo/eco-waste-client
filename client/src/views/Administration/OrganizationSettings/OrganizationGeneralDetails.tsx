import { Stack, Box, Badge, IconButton, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import {
  ColorPallet,
  ColorPalletSchema,
  Organization,
} from "../../../api/OrganizationSettings/organizationSettingsApi";
import useIsMobile from "../../../customHooks/useIsMobile";
import { hasSignedUrl } from "./orgUtils";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

function OrganizationGeneralDetails({
  organizationSettings,
}: {
  organizationSettings: Organization;
}) {
  const { isTablet } = useIsMobile();

  const parsedColorPallet = useMemo<ColorPallet[]>(() => {
    if (!organizationSettings?.colorPallet) return [];
    if (typeof organizationSettings.colorPallet === "string") {
      try {
        const palletArrayString = JSON.parse(organizationSettings.colorPallet);
        const palletArray = Array.isArray(palletArrayString)
          ? palletArrayString
          : [palletArrayString];

        return palletArray
          .map((pallet) => {
            const parsed =
              typeof pallet === "string" ? JSON.parse(pallet) : pallet;
            const result = ColorPalletSchema.safeParse(parsed);
            return result.success ? result.data : null;
          })
          .filter((pallet): pallet is ColorPallet => pallet !== null);
      } catch (error) {
        console.error("Error parsing color pallet:", error);
        return [];
      }
    }
    return organizationSettings.colorPallet
      .map((pallet) => {
        const result = ColorPalletSchema.safeParse(pallet);
        return result.success ? result.data : null;
      })
      .filter((pallet): pallet is ColorPallet => pallet !== null);
  }, [organizationSettings]);

  const logo = Array.isArray(organizationSettings.logoUrl)
    ? organizationSettings.logoUrl[0]
    : organizationSettings.logoUrl;

  return (
    <Stack
      gap={3}
      mt={3}
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        justifyContent: "space-between",
      }}
    >
      {hasSignedUrl(logo) && (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <img
            src={logo.signedUrl}
            alt="Organization Logo"
            style={{
              maxWidth: 300,
              maxHeight: 300,
              borderRadius: "50%",
              objectFit: "contain",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              padding: "1rem",
            }}
          />
        </Box>
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <DrawerContentItem
          label="Organization Name"
          value={organizationSettings?.organizationName}
        />

        <DrawerContentItem
          label="Organization Factory Name"
          value={organizationSettings?.organizationFactoryName}
        />
        <Box m={"0.5rem"}>
          <Box
            sx={{
              marginBottom: "0.4rem",
            }}
          >
            <Typography variant="caption" sx={{ color: "var(--pallet-grey)" }}>
              Color Pallet
            </Typography>
          </Box>

          {parsedColorPallet?.map((palette, index) => (
            <Box key={index} display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  width={20}
                  height={20}
                  borderRadius="50%"
                  bgcolor={palette.primaryColor}
                  border="1px solid #ccc"
                />
                <Typography variant="body2">Primary Color</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  width={20}
                  height={20}
                  borderRadius="50%"
                  bgcolor={palette.secondaryColor}
                  border="1px solid #ccc"
                />
                <Typography variant="body2">Secondary Color</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  width={20}
                  height={20}
                  borderRadius="50%"
                  bgcolor={palette.buttonColor}
                  border="1px solid #ccc"
                />
                <Typography variant="body2">Button Color</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  );
}

export default OrganizationGeneralDetails;
