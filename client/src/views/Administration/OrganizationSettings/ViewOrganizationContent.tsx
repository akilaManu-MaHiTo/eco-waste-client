import { AppBar, Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { useState } from "react";
import theme from "../../../theme";
import useIsMobile from "../../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Organization } from "../../../api/OrganizationSettings/organizationSettingsApi";
import { hasSignedUrl } from "./orgUtils";
import OrganizationGeneralDetails from "./OrganizationGeneralDetails";
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function ViewOrganizationContent({
  organizationSettings,
}: {
  organizationSettings: Organization;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const { isTablet } = useIsMobile();

  const insightImage = Array.isArray(organizationSettings.insightImage)
    ? organizationSettings.insightImage[0]
    : organizationSettings.insightImage;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
          flex: { lg: 3, md: 1 },
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderRadius: "0.3rem",
        }}
      >
        <AppBar position="static">
          <Tabs
            value={activeTab}
            onChange={handleChange}
            indicatorColor="secondary"
            TabIndicatorProps={{
              style: { backgroundColor: "var(--pallet-blue)", height: "3px" },
            }}
            sx={{
              backgroundColor: "var(--pallet-lighter-grey)",
              color: "var(--pallet-blue)",
            }}
            textColor="inherit"
            variant="scrollable"
            scrollButtons={true}
          >
            <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TextSnippetIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    General Details
                  </Typography>
                </Box>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <HomeOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Insight View
                  </Typography>
                </Box>
              }
              {...a11yProps(1)}
            />
            {/* <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <WarehouseOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    Departments
                  </Typography>
                </Box>
              }
              {...a11yProps(2)}
            /> */}
            {/* <Tab
              label={
                <Box
                  sx={{
                    color: "var(--pallet-blue)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StairsOutlinedIcon fontSize="small" />
                  <Typography variant="body2" sx={{ ml: "0.3rem" }}>
                    User Level
                  </Typography>
                </Box>
              }
              {...a11yProps(3)}
            /> */}
          </Tabs>
        </AppBar>
        <TabPanel value={activeTab} index={0} dir={theme.direction}>
          <OrganizationGeneralDetails
            organizationSettings={organizationSettings}
          />
        </TabPanel>
        <TabPanel value={activeTab} index={1} dir={theme.direction}>
          <Stack gap={2}>
            <DrawerContentItem
              label="Insight View Description"
              value={organizationSettings?.insightDescription}
            />
            {hasSignedUrl(insightImage) && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={insightImage.signedUrl}
                  alt="Insight View"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </Box>
            )}
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={2} dir={theme.direction}>
          <Stack gap={2}>
            <DrawerContentItem
              label="Insight View Description"
              value={organizationSettings?.organizationName}
            />
          </Stack>
        </TabPanel>
        <TabPanel value={activeTab} index={3} dir={theme.direction}>
          <Stack gap={2}>
            <DrawerContentItem
              label="Insight View Description"
              value={organizationSettings?.organizationName}
            />
          </Stack>
        </TabPanel>
      </Box>
    </Stack>
  );
}

export default ViewOrganizationContent;
