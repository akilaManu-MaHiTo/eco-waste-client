import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import theme from "../../theme";
import Breadcrumb from "../../components/BreadCrumb";
import PageTitle from "../../components/PageTitle";
import { UserRole } from "../../api/userApi";
import CustomButton from "../../components/CustomButton";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AccessManagementDrawerContent from "./AccessManagementDrawerContent";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddOrEditAccessRoleDialog from "./AddOrEditAccessRoleDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAccessRole,
  deleteAccessRole,
  getAccessRolesList,
  updateAccessRole,
} from "../../api/accessManagementApi";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { PermissionKeys } from "./SectionList";

function AccessManagementTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [openAccessManagementViewDrawer, setOpenAccessManagementViewDrawer] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addOrEditAccessRoleDialogOpen, setAddOrEditAccessRoleDialogOpen] =
    useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "User Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: roles, isFetching: isFetchingRoles } = useQuery({
    queryKey: ["access-roles"],
    queryFn: getAccessRolesList,
  });

  const { mutate: createAccessRoleMutation } = useMutation({
    mutationFn: createAccessRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-roles"] });
      enqueueSnackbar("Access Role Created Successfully!", {
        variant: "success",
      });
      setSelectedRole(null);
      setOpenAccessManagementViewDrawer(false);
      setAddOrEditAccessRoleDialogOpen(false);
    },
    onError: () => {
      enqueueSnackbar(`Access Role Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateAccessRoleMutation } = useMutation({
    mutationFn: updateAccessRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-roles"] });
      enqueueSnackbar("Accident Report Updated Successfully!", {
        variant: "success",
      });
      setSelectedRole(null);
      setOpenAccessManagementViewDrawer(false);
      setAddOrEditAccessRoleDialogOpen(false);
    },
    onError: () => {
      enqueueSnackbar(`Access Role Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteAccessMutation } = useMutation({
    mutationFn: deleteAccessRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-roles"] });
      enqueueSnackbar("Access Role Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRole(null);
      setOpenAccessManagementViewDrawer(false);
      setDeleteDialogOpen(false);
    },
    onError: () => {
      enqueueSnackbar(`Access Role Delete Failed`, {
        variant: "error",
      });
    },
  });

  return (
    <Stack>
      <Box
        sx={{
          padding: theme.spacing(2),
          boxShadow: 2,
          marginY: 2,
          borderRadius: 1,
          overflowX: "hidden",
        }}
      >
        <PageTitle title="User Management" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>
      <Stack sx={{ alignItems: "center" }}>
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            overflowX: "auto",
            maxWidth: isMobile ? "88vw" : "100%",
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(2),
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "var(--pallet-blue)" }}
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedRole(null);
                setAddOrEditAccessRoleDialogOpen(true);
              }}
              disabled={
                !useCurrentUserHaveAccess(
                  PermissionKeys.ADMIN_ACCESS_MNG_CREATE
                )
              }
            >
              Create New Role
            </Button>
          </Box>
          {isFetchingRoles && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles?.length > 0 ? (
                roles.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.userType}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="center">
                      <CustomButton
                        variant="contained"
                        sx={{
                          backgroundColor: "var(--pallet-blue)",
                        }}
                        size="medium"
                        onClick={() => {
                          setSelectedRole(row);
                          setOpenAccessManagementViewDrawer(true);
                        }}
                        startIcon={<VisibilityIcon />}
                      >
                        View Role Access
                      </CustomButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No roles found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openAccessManagementViewDrawer}
        handleClose={() => setOpenAccessManagementViewDrawer(false)}
        fullScreen={true}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Role Access Management"
              handleClose={() => setOpenAccessManagementViewDrawer(false)}
              onEdit={() => {
                setSelectedRole(selectedRole);
                setAddOrEditAccessRoleDialogOpen(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(PermissionKeys.ADMIN_ACCESS_MNG_EDIT)
              }
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                !useCurrentUserHaveAccess(
                  PermissionKeys.ADMIN_ACCESS_MNG_DELETE
                )
              }
            />
            {selectedRole && (
              <AccessManagementDrawerContent selectedRole={selectedRole} />
            )}
          </Stack>
        }
      />

      {addOrEditAccessRoleDialogOpen && (
        <AddOrEditAccessRoleDialog
          open={addOrEditAccessRoleDialogOpen}
          handleClose={() => setAddOrEditAccessRoleDialogOpen(false)}
          onSubmit={(data) => {
            if (selectedRole) {
              updateAccessRoleMutation(data);
            } else {
              createAccessRoleMutation(data);
            }
          }}
          defaultValues={selectedRole}
        />
      )}

      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Role Confirmation"
          content={
            <>
              Are you sure you want to remove this role?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteAccessMutation(selectedRole.id);
          }}
          onSuccess={() => {
            setOpenAccessManagementViewDrawer(false);
            setSelectedRole(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Role Deleted Successfully!", {
              variant: "success",
            });
          }}
          handleReject={() => {
            setOpenAccessManagementViewDrawer(false);
            setSelectedRole(null);
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default AccessManagementTable;
