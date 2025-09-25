import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import { useQuery } from "@tanstack/react-query";
import ViewOrganizationContent from "./ViewOrganizationContent";
import { getOrganization } from "../../../api/OrganizationSettings/organizationSettingsApi";
import { useMemo, useState } from "react";
import EditOrganizationDialog from "./EditOrganizationDialog";
import { Box, Stack } from "@mui/material";
import CustomButton from "../../../components/CustomButton";
import EditIcon from "@mui/icons-material/Edit";

function OrganizationSettings() {
  const [openEditOrganizationDialog, setOpenEditOrganizationDialog] =
    useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Organization Settings" },
  ];

  const { data: organizationData } = useQuery({
    queryKey: ["organization"],
    queryFn: getOrganization,
  });

  return (
    <Stack sx={{ padding: 0 }}>
      <Box
        sx={{
          padding: theme.spacing(2),
          boxShadow: 2,
          marginY: 2,
          borderRadius: 1,
          overflowX: "hidden",
        }}
      >
        <PageTitle title="Organization Settings" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: theme.spacing(2),
        }}
      >
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          startIcon={<EditIcon />}
          onClick={() => setOpenEditOrganizationDialog(true)}
        >
          Edit General Details
        </CustomButton>
      </Box>
      <Stack>
        <ViewOrganizationContent organizationSettings={organizationData} />
      </Stack>
      {openEditOrganizationDialog && (
        <EditOrganizationDialog
          open={openEditOrganizationDialog}
          handleClose={() => setOpenEditOrganizationDialog(false)}
          defaultValues={organizationData}
        />
      )}
    </Stack>
  );
}

export default OrganizationSettings;
