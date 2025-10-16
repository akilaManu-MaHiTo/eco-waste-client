import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
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
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";

import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import ViewGarbageCollectionContent from "./ViewWasteCollectionContent";
import CollectionRouteModal from "./CollectionRouteModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

import {
  fetchGarbageCollectionData,
  fetchGarbageCollectionDataApproved,
  GarbageRequest,
} from "../../api/garbageRequestApi";

function WasteCollectionRequestTable({
  isPendingData,
  isApprovedData,
}: {
  isPendingData?: boolean;
  isApprovedData?: boolean;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<GarbageRequest | null>(null);
  const [openCollectionRouteModal, setOpenCollectionRouteModal] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [checkedRows, setCheckedRows] = useState<string[]>([]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const { data: garbageCollectionData, isFetching } = useQuery({
    queryKey: ["garbage-collection"],
    queryFn: fetchGarbageCollectionData,
  });
  console.log(garbageCollectionData);
  const {
    data: garbageCollectionDataApproved,
    isFetching: isFetchingApproved,
  } = useQuery({
    queryKey: ["garbage-collection-approved"],
    queryFn: fetchGarbageCollectionDataApproved,
  });
  console.log(garbageCollectionDataApproved);

  const handleCheckboxChange = (row: GarbageRequest) => {
    setCheckedRows((prev) =>
      prev.includes(row._id)
        ? prev.filter((id) => id !== row._id)
        : [...prev, row._id]
    );
  };

  const paginatedData = useMemo(() => {
    if (isPendingData) {
      if (!garbageCollectionData) return [];
      if (rowsPerPage === -1) {
        return garbageCollectionData;
      }
      return garbageCollectionData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      if (!garbageCollectionDataApproved) return [];
      if (rowsPerPage === -1) {
        return garbageCollectionDataApproved;
      }
      return garbageCollectionDataApproved.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [
    garbageCollectionData,
    page,
    rowsPerPage,
    garbageCollectionDataApproved,
    isPendingData,
    isApprovedData,
  ]);

  return (
    <Stack spacing={2}>
      <Box sx={{ p: 2, boxShadow: 2, borderRadius: 1, overflowX: "hidden" }}>
        <PageTitle title="Waste Management" />
        <Breadcrumb
          breadcrumbs={[
            { title: "Home", href: "/home" },
            { title: "Waste Management" },
          ]}
        />
      </Box>

      <Stack alignItems="flex-end">
        {checkedRows.length > 0 && (
          <Box sx={{ py: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "var(--eco-waste-blue)" }}
              startIcon={<AddIcon />}
              onClick={() => setOpenCollectionRouteModal(true)}
            >
              Add Collection Route
            </Button>
          </Box>
        )}

        <TableContainer
          component={Paper}
          elevation={2}
          sx={{ overflowX: "auto", maxWidth: isMobile ? "88vw" : "100%" }}
        >
          {isFetching ||
            (isFetchingApproved && <LinearProgress sx={{ width: "100%" }} />)}

          <Table>
            <TableHead
              sx={{ backgroundColor: "var(--eco-waste-secondary-green)" }}
            >
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Status</TableCell>
                {isApprovedData && <TableCell>Select</TableCell>}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length ? (
                paginatedData.map((row) => (
                  <TableRow
                    key={row._id}
                    hover
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenViewDrawer(true);
                    }}
                  >
                    <TableCell>{row._id}</TableCell>
                    <TableCell>{row.dateAndTime}</TableCell>
                    <TableCell>{row.garbageId?.createdBy?.username}</TableCell>
                    <TableCell>{row.garbageId?.createdBy?.mobile}</TableCell>
                    <TableCell>
                      {row.garbageId?.binId?.thresholdLevel} Kg
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.status}
                        sx={{
                          backgroundColor:
                            row.status === "Pending"
                              ? "var(--eco-waste-blue)"
                              : row.status === "Approved"
                              ? "var(--pallet-light-blue)"
                              : "var(--eco-waste-primary-green)",
                          color: "white",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {row.status === "Pending" && (
                        <Checkbox
                          sx={{
                            color: "var(--eco-waste-blue)",
                            "&.Mui-checked": {
                              color: "var(--eco-waste-blue)",
                            },
                          }}
                          checked={checkedRows.includes(row._id)}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleCheckboxChange(row)}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>No records found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  count={garbageCollectionData?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                  }}
                  showFirstButton
                  showLastButton
                  colSpan={7}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Stack>

      {/* View Drawer */}
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        fullScreen={isMobile}
        drawerContent={
          selectedRow && (
            <Stack spacing={1} sx={{ px: 1 }}>
              <DrawerHeader
                title="Waste Details"
                handleClose={() => setOpenViewDrawer(false)}
                onEdit={() => setOpenCollectionRouteModal(true)}
                onDelete={() => setDeleteDialogOpen(true)}
              />
              {selectedRow && (
                <ViewGarbageCollectionContent garbageCollection={selectedRow} />
              )}
            </Stack>
          )
        }
      />

      {/* Collection Route Modal */}
      {openCollectionRouteModal && (
        <CollectionRouteModal
          open={openCollectionRouteModal}
          handleClose={() => setOpenCollectionRouteModal(false)}
          selectedRowsData={garbageCollectionData?.filter((row) =>
            checkedRows.includes(row._id)
          )}
        />
      )}

      {/* Delete Confirmation */}
      {deleteDialogOpen && selectedRow && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Delete Waste Confirmation"
          content={
            <>
              Are you sure you want to remove this Waste?
              <Alert severity="warning" sx={{ mt: 1 }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            // Implement delete logic here
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
