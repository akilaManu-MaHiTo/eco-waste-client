import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { GarbageRequest } from "../../api/garbageRequestApi";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import AddIcon from "@mui/icons-material/Add";
import { wasteCollectionRequest } from "../../api/garbage";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import ViewGarbageContent from "../Garbage/ViewGarbageContent";
import AddOrEditGarbageDialog from "../Garbage/AddOrEditGarbageDialog";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { format } from "date-fns";

function WasteCollectionRequestTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<GarbageRequest>(null);
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
          {
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
                // disabled={isWasteCreateDisabled}
              >
                Add Waste
              </Button>
            </Box>
          }
          {/* {(<LinearProgress sx={{ width: "100%" }} />)} */}
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
              {wasteCollectionRequest?.length > 0 ? (
                wasteCollectionRequest?.map((row) => (
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
                    <TableCell align="left">{row.userId.name}</TableCell>
                    <TableCell align="left">{row?.userId.mobile}</TableCell>
                    <TableCell align="left">
                      {row.garbageId.thresholdLevel + " " + "Kg"}
                    </TableCell>
                    {/* <TableCell align="left">
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
                    wasteCollectionRequest ? wasteCollectionRequest.length : 0
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
              //   disableEdit={
              //     isWasteEditDisabled || selectedRow?.status === "Collected"
              //   }
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              //   disableDelete={
              //     isWasteDeleteDisabled || selectedRow?.status === "Collected"
              //   }
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
            // deleteGarbageMutation(selectedRow._id);
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

export default WasteCollectionRequestTable;
