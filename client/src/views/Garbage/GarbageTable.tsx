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
import DownloadIcon from "@mui/icons-material/Download";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import AddOrEditGarbageDialog from "./AddOrEditGarbageDialog";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ViewGarbageContent from "./ViewGarbageContent";
import { PermissionKeys } from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import {
  deleteGarbage,
  fetchGarbage,
  fetchTodayGarbage,
  Garbage,
} from "../../api/garbage";
import CustomButton from "../../components/CustomButton";

function GarbageTable({
  isTodayGarbage = false,
  isGarbage = true,
}: {
  isTodayGarbage?: boolean;
  isGarbage?: boolean;
}) {
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
    { title: `${isTodayGarbage ? "Daily Waste" : "Waste Management"}` },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: garbageData, isFetching: isGarbageDataFetching } = useQuery({
    queryKey: ["garbage"],
    queryFn: fetchGarbage,
    enabled: !isTodayGarbage,
  });
  console.log("garbageData", garbageData);

  const { data: todayGarbageData, isFetching: isTodayGarbageDataFetching } =
    useQuery({
      queryKey: ["today-garbage"],
      queryFn: fetchTodayGarbage,
      enabled: isTodayGarbage,
    });

  const { mutate: deleteGarbageMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteGarbage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["garbage"] });
      queryClient.invalidateQueries({ queryKey: ["today-garbage"] });
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
  const paginatedGarbageData = useMemo(() => {
    if (isTodayGarbage) {
      if (!todayGarbageData) return [];
      if (rowsPerPage === -1) {
        return todayGarbageData;
      }
      return todayGarbageData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      if (!garbageData) return [];
      if (rowsPerPage === -1) {
        return garbageData;
      }
      return garbageData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [garbageData, page, rowsPerPage, todayGarbageData, isTodayGarbage]);

  // Calculate statistics
  const calculateStats = () => {
    const dataSource = isTodayGarbage ? todayGarbageData : garbageData;
    if (!dataSource || dataSource.length === 0) {
      return {
        totalWeight: 0,
        totalRecords: 0,
        pendingCount: 0,
        requestedCount: 0,
        collectedCount: 0,
      };
    }

    const totalWeight = dataSource.reduce(
      (sum, item) => sum + (item.wasteWeight || 0),
      0
    );
    const totalRecords = dataSource.length;
    const pendingCount = dataSource.filter((item) => item.status === "Pending").length;
    const requestedCount = dataSource.filter((item) => item.status === "Requested").length;
    const collectedCount = dataSource.filter((item) => item.status === "Collected").length;

    return {
      totalWeight: totalWeight.toFixed(2),
      totalRecords,
      pendingCount,
      requestedCount,
      collectedCount,
    };
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      const currentDate = format(new Date(), "yyyy-MM-dd");
      const dataSource = isTodayGarbage ? todayGarbageData : garbageData;

      if (!dataSource || dataSource.length === 0) {
        enqueueSnackbar("No data available to generate report", { variant: "warning" });
        return;
      }

      // Add title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(
        isTodayGarbage ? "DAILY WASTE REPORT" : "WASTE MANAGEMENT REPORT",
        105,
        15,
        { align: "center" }
      );

      // Add date
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${currentDate}`, 105, 22, { align: "center" });

      // Add statistics
      const stats = calculateStats();
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Summary Statistics", 14, 35);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Records: ${stats.totalRecords}`, 14, 42);
      doc.text(`Total Weight: ${stats.totalWeight} Kg`, 14, 49);
      doc.text(`Pending: ${stats.pendingCount}`, 14, 56);
      doc.text(`Requested: ${stats.requestedCount}`, 70, 56);
      doc.text(`Collected: ${stats.collectedCount}`, 126, 56);

      // Prepare table data
      const tableData = dataSource.map((row) => [
        row._id,
        row?.createdAt ? format(new Date(row.createdAt), "yyyy-MM-dd") : "N/A",
        row.garbageCategory,
        row?.binId?.binId || "N/A",
        `${row.wasteWeight} Kg`,
        row.status,
      ]);

      // Add table
      autoTable(doc, {
        head: [["Reference", "Date", "Category", "Bin Number", "Weight", "Status"]],
        body: tableData,
        startY: 65,
        styles: { fontSize: 8 },
        headStyles: {
          fillColor: [76, 175, 80], // Green color matching theme
          textColor: [255, 255, 255],
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
        },
      });

      // Save the PDF
      const fileName = isTodayGarbage
        ? `daily-waste-report-${currentDate}.pdf`
        : `waste-management-report-${currentDate}.pdf`;
      doc.save(fileName);

      enqueueSnackbar("PDF report generated successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      enqueueSnackbar("Failed to generate PDF report", { variant: "error" });
    }
  };

  // Generate CSV Report
  const generateCSVReport = () => {
    try {
      const dataSource = isTodayGarbage ? todayGarbageData : garbageData;

      if (!dataSource || dataSource.length === 0) {
        enqueueSnackbar("No data available to generate report", { variant: "warning" });
        return;
      }

      let csvContent = "Reference,Date,Waste Category,Bin Number,Weight (Kg),Status\n";

      dataSource.forEach((row) => {
        const date = row?.createdAt
          ? format(new Date(row.createdAt), "yyyy-MM-dd")
          : "N/A";
        const binId = row?.binId?.binId || "N/A";
        
        csvContent += `${row._id},`;
        csvContent += `${date},`;
        csvContent += `${row.garbageCategory},`;
        csvContent += `${binId},`;
        csvContent += `${row.wasteWeight},`;
        csvContent += `${row.status}\n`;
      });

      // Create a blob and download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName = isTodayGarbage
        ? `daily-waste-report-${format(new Date(), "yyyy-MM-dd")}.csv`
        : `waste-management-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      enqueueSnackbar("CSV report generated successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error generating CSV:", error);
      enqueueSnackbar("Failed to generate CSV report", { variant: "error" });
    }
  };

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
        <PageTitle
          title={`${isTodayGarbage ? "Daily Waste" : "Waste Management"}`}
        />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>
      <Stack sx={{ alignItems: "center" }}>
        {/* Export Buttons */}
        <Box
          sx={{
            width: "100%",
            mb: 2,
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            px: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={generatePDFReport}
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" },
            }}
            disabled={
              (isTodayGarbage && (!todayGarbageData || todayGarbageData.length === 0)) ||
              (!isTodayGarbage && (!garbageData || garbageData.length === 0))
            }
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<TableChartIcon />}
            onClick={generateCSVReport}
            sx={{
              bgcolor: "#2e7d32",
              "&:hover": { bgcolor: "#1b5e20" },
            }}
            disabled={
              (isTodayGarbage && (!todayGarbageData || todayGarbageData.length === 0)) ||
              (!isTodayGarbage && (!garbageData || garbageData.length === 0))
            }
          >
            Export CSV
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            overflowX: "auto",
            maxWidth: isMobile ? "88vw" : "100%",
          }}
        >
          {isTodayGarbage && (
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
          {(isGarbageDataFetching ||
            isTodayGarbageDataFetching ||
            isDeleting) && <LinearProgress sx={{ width: "100%" }} />}
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
              {paginatedGarbageData?.length > 0 ? (
                paginatedGarbageData?.map((row) => (
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
                    isTodayGarbage
                      ? todayGarbageData?.length || 0
                      : garbageData?.length || 0
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
                isWasteEditDisabled || selectedRow?.status === "Requested"
              }
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
              disableDelete={
                isWasteDeleteDisabled || selectedRow?.status === "Requested"
              }
            />

            {selectedRow && (
              <Stack>
                <ViewGarbageContent
                  garbage={selectedRow}
                  isGarbageDataFetching={isGarbageDataFetching}
                  onClose={() => setOpenViewDrawer(false)}
                />
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
