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
import AddOrEditGarbageDialog from "./AddOrEditWasteBinDialog";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

import ViewGarbageContent from "./ViewWasteBinContent";
import { PermissionKeys } from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { Garbage, garbageData } from "../../api/garbage";
import CustomButton from "../../components/CustomButton";

function HazardRiskTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Garbage>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [riskData, setRiskData] = useState<HazardAndRisk[]>(sampleHazardRiskData);
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
    { title: `Waste Bin Management` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  //   const { data: riskData, isFetching: isRiskDataFetching } = useQuery({
  //     queryKey: ["hazardRisks"],
  //     queryFn: getHazardRiskList,
  //   });

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

  //   const { mutate: createHazardRiskMutation } = useMutation({
  //     mutationFn: createHazardRisk,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
  //       queryClient.invalidateQueries({ queryKey: ["assigned-hazardRisks"] });
  //       enqueueSnackbar("Hazard Risk Report Created Successfully!", {
  //         variant: "success",
  //       });
  //       setSelectedRow(null);
  //       setOpenViewDrawer(false);
  //       setOpenAddOrEditDialog(false);
  //     },
  //     onError: () => {
  //       enqueueSnackbar(`Hazard Risk Creation Failed`, {
  //         variant: "error",
  //       });
  //     },
  //   });

  //   const { mutate: updateHazardRiskMutation } = useMutation({
  //     mutationFn: updateHazardRisk,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
  //       queryClient.invalidateQueries({ queryKey: ["assigned-hazardRisks"] });
  //       enqueueSnackbar("Hazard Risk Report Update Successfully!", {
  //         variant: "success",
  //       });
  //       setSelectedRow(null);
  //       setOpenViewDrawer(false);
  //       setOpenAddOrEditDialog(false);
  //     },
  //     onError: () => {
  //       enqueueSnackbar(`Hazard Risk Update Failed`, {
  //         variant: "error",
  //       });
  //     },
  //   });

  //   const { mutate: deleteHazardRiskMutation } = useMutation({
  //     mutationFn: deleteHazardRisk,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
  //       queryClient.invalidateQueries({ queryKey: ["assigned-hazardRisks"] });
  //       enqueueSnackbar("Hazard Risk Report Deleted Successfully!", {
  //         variant: "success",
  //       });
  //       setSelectedRow(null);
  //       setOpenViewDrawer(false);
  //       setOpenAddOrEditDialog(false);
  //     },
  //     onError: () => {
  //       enqueueSnackbar(`Hazard Risk Delete Failed`, {
  //         variant: "error",
  //       });
  //     },
  //   });

  const isWasteCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_CREATE
  );
  //   const isRiskEditDisabled = !useCurrentUserHaveAccess(
  //     PermissionKeys.HAZARD_RISK_REGISTER_EDIT
  //   );
  //   const isRiskDeleteDisabled = !useCurrentUserHaveAccess(
  //     PermissionKeys.HAZARD_RISK_REGISTER_DELETE
  //   );
  //   const isRiskAssignCreateDisabled = !useCurrentUserHaveAccess(
  //     PermissionKeys.HAZARD_RISK_ASSIGNED_TASKS_CREATE
  //   );
  //   const isRiskAssignEditDisabled = !useCurrentUserHaveAccess(
  //     PermissionKeys.HAZARD_RISK_ASSIGNED_TASKS_EDIT
  //   );
  //   const isRiskAssignDeleteDisabled = !useCurrentUserHaveAccess(
  //     PermissionKeys.HAZARD_RISK_ASSIGNED_TASKS_DELETE
  //   );

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
        <PageTitle title={`Waste Bin Management`} />
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
                sx={{ backgroundColor: "var(--pallet-blue)" }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedRow(null);
                  setOpenAddOrEditDialog(true);
                }}
                disabled={isWasteCreateDisabled}
              >
                Add a Bin
              </Button>
            </Box>
          )}
          {/* {(isRiskDataFetching || isAssignedRiskDataFetching) && (
            <LinearProgress sx={{ width: "100%" }} />
          )} */}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="left">Bin ID</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Current Waste Level</TableCell>
                <TableCell align="left">Threshold Level</TableCell>
                <TableCell align="left">Bin Type </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {garbageData?.length > 0 ? (
                garbageData?.map((row) => (
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
                    {/* <TableCell component="th" scope="row">
                      {row.created_at
                        ? format(new Date(row.created_at), "yyyy-MM-dd")
                        : "N/A"}
                    </TableCell> */}
                    <TableCell align="left">{row._id}</TableCell>
                    <TableCell align="left">{row.garbageCategory}</TableCell>
                    <TableCell align="left">{row.garbageId}</TableCell>
                    <TableCell align="left">{row.wasteWeight}</TableCell>
                    <TableCell align="left">{row.wasteWeight}</TableCell>
                    {/* <TableCell align="right">
                      {format(new Date(row.dueDate), "yyyy-MM-dd")}
                    </TableCell> */}
                    {/* <TableCell align="center">
                      {row.dueDate
                        ? (() => {
                            const daysRemaining = differenceInDays(
                              new Date(),
                              row.dueDate
                            );
                            if (daysRemaining > 0) {
                              return "No Remains"; // No remaining days
                            }
                            return `${Math.abs(daysRemaining)}`; // Show remaining days if positive
                          })()
                        : null}{" "}
                    </TableCell> */}

                    {/* <TableCell align="center">
                      {row.dueDate
                        ? (() => {
                            const daysDelay = differenceInDays(
                              new Date(),
                              row.dueDate
                            );
                            if (daysDelay <= 0) {
                              return "No Delays"; // No delayed days
                            }
                            return `${Math.abs(daysDelay)}`; // Show delayed days if negative
                          })()
                        : null}{" "}
                    </TableCell> */}
                    {/* <TableCell align="right">{row.createdByUserName}</TableCell>
                    <TableCell align="right">{row.assignee?.name}</TableCell> */}
                    {/* <TableCell align="right">
                      {row.status === HazardAndRiskStatus.APPROVED ? (
                        <Chip
                          label={"Approved"}
                          sx={{
                            color: "var(--pallet-green)",
                            backgroundColor: colors.green[50],
                          }}
                        />
                      ) : (
                        <Chip
                          label={"Draft"}
                          sx={{
                            color: "var(--pallet-orange)",
                            backgroundColor: colors.orange[50],
                          }}
                        />
                      )}
                    </TableCell> */}
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
                    isAssignedTasks ? garbageData?.length : garbageData?.length
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
              title="Hazard or Risk Details"
              handleClose={() => setOpenViewDrawer(false)}
              //   disableEdit={
              //     isAssignedTasks
              //       ? isRiskAssignEditDisabled ||
              //         selectedRow?.status === HazardAndRiskStatus.APPROVED
              //       : isRiskEditDisabled ||
              //         selectedRow?.status === HazardAndRiskStatus.APPROVED
              //   }
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              //   disableDelete={
              //     isAssignedTasks
              //       ? isRiskAssignDeleteDisabled
              //       : isRiskDeleteDisabled
              //   }
            />

            {selectedRow && (
              <Stack>
                <ViewGarbageContent garbage={selectedRow} />
                <CustomButton
                  variant="contained"
                  sx={{
                    backgroundColor: "var(--pallet-blue)",
                    marginTop: "1rem",
                    marginX: "0.5rem",
                  }}
                  size="medium"
                  //   onClick={() => setApproveDialogOpen(true)}
                >
                  Approve Medicine Request
                </CustomButton>
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditGarbageDialog
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
          title="Remove Hazard/Risk Confirmation"
          content={
            <>
              Are you sure you want to remove this hazard or risk?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            // setRiskData(riskData.filter((doc) => doc.id !== selectedRow.id));
            // deleteHazardRiskMutation(selectedRow.id);
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            // enqueueSnackbar("Hazard Risk Record Deleted Successfully!", {
            //   variant: "success",
            // });
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

export default HazardRiskTable;
