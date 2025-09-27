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
import AddOrEditGarbageDialog from "./AddOrEditGarbageDialog";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";

import ViewGarbageContent from "./ViewGarbageContent";
import { PermissionKeys } from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { deleteGarbage, fetchGarbage, Garbage } from "../../api/garbage";
import CustomButton from "../../components/CustomButton";

function GarbageTable({ isAssignedTasks }: { isAssignedTasks: boolean }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Garbage>(null);
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
    { title: `Waste Management` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: garbageData, isFetching: isGarbageDataFetching } = useQuery({
    queryKey: ["garbage"],
    queryFn: fetchGarbage,
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

  const { mutate: deleteGarbageMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteGarbage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      enqueueSnackbar("Waste Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setDeleteDialogOpen(false);
      setOpenViewDrawer(false);
    },
    onError: () => {
      enqueueSnackbar(`Waste Delete Failed!`, {
        variant: "error",
      });
    },
  });

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
        <PageTitle title={`Waste Management`} />
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
                Add Waste
              </Button>
            </Box>
          )}
          {isGarbageDataFetching ||
            (isDeleting && <LinearProgress sx={{ width: "100%" }} />)}
          <Table aria-label="simple table">
            <TableHead
              sx={{ backgroundColor: "var(--eco-waste-secondary-green)" }}
            >
              <TableRow>
                <TableCell align="left">Reference</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Waste Category</TableCell>
                <TableCell align="left">Bin Number</TableCell>
                <TableCell align="left">Weight</TableCell>
                <TableCell align="left">Status</TableCell>
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
                    <TableCell align="left">{row._id}</TableCell>
                    <TableCell component="th" scope="row">
                      {row?.createdAt
                        ? format(new Date(row?.createdAt), "yyyy-MM-dd")
                        : "N/A"}
                    </TableCell>
                    <TableCell align="left">{row.garbageCategory}</TableCell>
                    <TableCell align="left">{row?.binId?.binId}</TableCell>
                    <TableCell align="left">
                      {row.wasteWeight + " " + "Kg"}
                    </TableCell>
                    <TableCell align="left">
                      {row.status === "Pending" ? (
                        <Chip
                          label="Pending"
                          sx={{
                            backgroundColor: "var(--eco-waste-blue)",
                            color: "white",
                          }}
                        />
                      ) : row.status === "Requested" ? (
                        <Chip
                          label="Requested"
                          sx={{
                            backgroundColor: "var(--pallet-light-blue)",
                            color: "white",
                          }}
                        />
                      ) : (
                        <Chip
                          label="Collected"
                          sx={{
                            backgroundColor: "var(--eco-waste-primary-green)",
                            color: "white",
                          }}
                        />
                      )}
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
              title="Waste Details"
              handleClose={() => setOpenViewDrawer(false)}
              disableEdit={
                isWasteEditDisabled || selectedRow?.status === "Collected"
              }
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isWasteDeleteDisabled || selectedRow?.status === "Collected"
              }
            />

            {selectedRow && (
              <Stack>
                <ViewGarbageContent garbage={selectedRow} />
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
          title="Delete Waste Confirmation"
          content={
            <>
              Are you sure you want to remove this Waste?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteGarbageMutation(selectedRow._id);
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

export default GarbageTable;
