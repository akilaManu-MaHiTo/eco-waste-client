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
import AddOrEditWasteBinDialog from "./AddOrEditWasteBinDialog";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

import ViewWasteBinContent from "./ViewWasteBinContent";
import { PermissionKeys } from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import CustomButton from "../../components/CustomButton";
import { deleteWasteBin, fetchWasteBins, WasteBin } from "../../api/wasteBin";

function WasteBinTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<WasteBin>(null);
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
    { title: `Waste Bin Management` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: wasteBinData, isFetching: isWasteBinDataFetching } = useQuery({
    queryKey: ["wasteBin"],
    queryFn: fetchWasteBins,
  });

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

  const { mutate: deleteWasteBinMutation, isPending: isDeleting } = useMutation(
    {
      mutationFn: deleteWasteBin,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["wastebin"] });
        enqueueSnackbar("Waste Bin Deleted Successfully!", {
          variant: "success",
        });
        setSelectedRow(null);
        setDeleteDialogOpen(false);
        setOpenViewDrawer(false);
      },
      onError: () => {
        enqueueSnackbar(`Waste BIn Delete Failed!`, {
          variant: "error",
        });
      },
    }
  );

  const isWasteCreateDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_CREATE
  );
  const isWasteEditDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.WASTE_MNG_HISTORY_EDIT
  );
  const isWasteDeleteDisabled = !useCurrentUserHaveAccess(
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
                sx={{ backgroundColor: "var(--eco-waste-blue)" }}
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedRow(null);
                  setOpenAddOrEditDialog(true);
                }}
                disabled={isWasteCreateDisabled}
              >
                Add Bin
              </Button>
            </Box>
          )}
          {isWasteBinDataFetching ||
            (isDeleting && <LinearProgress sx={{ width: "100%" }} />)}
          <Table aria-label="simple table">
            <TableHead
              sx={{ backgroundColor: "var(--eco-waste-secondary-green)" }}
            >
              <TableRow>
                <TableCell align="left">Bin ID</TableCell>
                <TableCell align="left">Current Waste Level</TableCell>
                <TableCell align="left">Threshold Level</TableCell>
                <TableCell align="left">Bin Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wasteBinData?.length > 0 ? (
                wasteBinData?.map((row) => (
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
                    <TableCell align="left">{row.binId}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.currentWasteLevel}
                    </TableCell>
                    <TableCell align="left">{row.thresholdLevel}</TableCell>
                    <TableCell align="left">{row.binType}</TableCell>
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
                      ? wasteBinData?.length
                      : wasteBinData?.length
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
              title="Waste Details"
              handleClose={() => setOpenViewDrawer(true)}
              disableEdit={isWasteEditDisabled || !selectedRow?.availability}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isWasteDeleteDisabled || !selectedRow?.availability
              }
            />

            {selectedRow && (
              <Stack>
                <ViewWasteBinContent wasteBin={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditWasteBinDialog
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
          title="Delete Waste Bin Confirmation"
          content={
            <>
              Are you sure you want to remove this Waste Bin?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteWasteBinMutation(selectedRow._id);
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
