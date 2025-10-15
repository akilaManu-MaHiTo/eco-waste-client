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
  Chip,
  colors,
  LinearProgress,
  Stack,
  TableFooter,
  TablePagination,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useMemo, useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import AddOrEditTrucknDialog from "./AddOrEditTruckDialog.tsx";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

import ViewTruckContent from "./ViewTruckContent";
import { PermissionKeys } from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import CustomButton from "../../components/CustomButton";
import { deleteWasteBin, fetchWasteBins, WasteBin } from "../../api/wasteBin";
import { deleteTruck, fetchTrucks, Truck } from "../../api/truck.ts";

function WasteBinTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Truck>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // handle pagination
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: `Truck Management` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: truckData, isFetching: istruckDataFetching } = useQuery({
    queryKey: ["truck-data"],
    queryFn: fetchTrucks,
  });

  console.log("truckData", truckData);

  //   const paginatedRiskData = useMemo(() => {
  //     if (isAssignedTasks) {
  //       if (!assignedRiskData) return [];
  //       if (rowsPerPage === -1) {
  //         return assignedRiskData;
  //       }
  //       return assignedRiskData.slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage
  //       );
  //     } else {
  //       if (!riskData) return [];
  //       if (rowsPerPage === -1) {
  //         return riskData;
  //       }
  //       return riskData.slice(
  //         page * rowsPerPage,
  //         page * rowsPerPage + rowsPerPage
  //       );
  //     }
  //   }, [isAssignedTasks, assignedRiskData, page, rowsPerPage, riskData]);

  const { mutate: deleteTruckMutation, isPending: isDeleting } = useMutation(
    {
      mutationFn: deleteTruck,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["truck-data"] });
        enqueueSnackbar("Truck Deleted Successfully!", {
          variant: "success",
        });
        setSelectedRow(null);
        setDeleteDialogOpen(false);
        setOpenViewDrawer(false);
      },
      onError: () => {
        enqueueSnackbar(`Truck Delete Failed!`, {
          variant: "error",
        });
      },
    }
  );

  const isTruckCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_CREATE
  );
  const isTruckEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_EDIT
  );
  const isTruckDeleteDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_DELETE
  );

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
        <PageTitle title={`Truck Management`} />
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
          {!isAssignedTasks && (
            <Box
              sx={{
                padding: theme.spacing(2),
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: "var(--eco-waste-blue)" }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedRow(null);
                  setOpenAddOrEditDialog(true);
                }}
                disabled={isTruckCreateDisabled}
              >
                Add Truck
              </Button>
            </Box>
          )}
          {istruckDataFetching ||
            (isDeleting && <LinearProgress sx={{ width: "100%" }} />)}
          <Table aria-label="simple table">
            <TableHead
              sx={{ backgroundColor: "var(--eco-waste-secondary-green)" }}
            >
              <TableRow>
                <TableCell align="left">Truck ID</TableCell>
                <TableCell align="left">Capacity</TableCell>
                <TableCell align="left">Driver</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {truckData?.length > 0 ? (
                truckData?.map((row) => (
                  <TableRow
                    key={`${row._id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenViewDrawer(true);
                    }}
                  >
                    <TableCell align="left">{row.truckId}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.capacity} kg
                    </TableCell>
                    <TableCell align="left">{row.driver.username}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            row.status === "Available"
                              ? colors.green[100]
                              : row.status === "In Service"
                              ? colors.blue[100]
                              : row.status === "Under Maintenance"
                              ? colors.orange[100]
                              : colors.grey[100],
                          color:
                            row.status === "Available"
                              ? colors.green[800]
                              : row.status === "In Service"
                              ? colors.blue[800]
                              : row.status === "Under Maintenance"
                              ? colors.orange[800]
                              : colors.grey[800],
                          fontWeight: 600,
                          border: `1px solid ${
                            row.status === "Available"
                              ? colors.green[300]
                              : row.status === "In Service"
                              ? colors.blue[300]
                              : row.status === "Under Maintenance"
                              ? colors.orange[300]
                              : colors.grey[300]
                          }`,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Records found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={100}
                  count={
                    isAssignedTasks
                      ? truckData?.length
                      : truckData?.length
                  }
                  rowsPerPage={rowsPerPage}
                  page={page}
                  showFirstButton={true}
                  showLastButton={true}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        fullScreen={isMobile ? true : false}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Truck Details"
              handleClose={() => setOpenViewDrawer(true)}
              disableEdit={isTruckEditDisabled}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isTruckDeleteDisabled
              }
            />

            {selectedRow && (
              <Stack>
                <ViewTruckContent truck={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditTrucknDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Delete Truck Confirmation"
          content={
            <>
              Are you sure you want to remove this Truck?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteTruckMutation(selectedRow._id);
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
          }}
          handleReject={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default WasteBinTable;
