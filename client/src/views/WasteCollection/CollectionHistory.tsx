import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
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
  Theme,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
} from "@mui/icons-material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCompletedRequests } from "../../api/garbageRequestApi";
import { useState } from "react";
import { format } from "date-fns";
import { Delivery } from "../../api/delivery";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CollectionHistory() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const breadcrumbItems = [
    { title: "Waste Collection", href: "/home" },
    { title: `Collection History` },
  ];

  const {
    data: completedRoutes,
    isFetching: isLoading,
  } = useQuery({
    queryKey: ["completed-routes"],
    queryFn: fetchAllCompletedRequests,
  });

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

  const toggleRowExpansion = (routeId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(routeId)) {
        newSet.delete(routeId);
      } else {
        newSet.add(routeId);
      }
      return newSet;
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!completedRoutes) return { totalRoutes: 0, totalWaste: 0, totalRevenue: 0 };
    
    let totalWaste = 0;
    let totalRevenue = 0;

    completedRoutes.forEach((route: Delivery) => {
      route.garbage.forEach((item) => {
        totalWaste += item.garbageId?.wasteWeight || 0;
        totalRevenue += item.price || 0;
      });
    });

    return {
      totalRoutes: completedRoutes.length,
      totalWaste: totalWaste.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
    };
  };

  const stats = calculateStats();

  // Generate PDF Report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    const currentDate = format(new Date(), "yyyy-MM-dd");

    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("COLLECTION HISTORY REPORT", 105, 15, { align: "center" });

    // Add date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${currentDate}`, 105, 22, { align: "center" });

    // Add statistics
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary Statistics", 14, 35);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Completed Routes: ${stats.totalRoutes}`, 14, 42);
    doc.text(`Total Waste Collected: ${stats.totalWaste} kg`, 14, 49);
    doc.text(`Total Revenue: Rs. ${stats.totalRevenue}`, 14, 56);

    // Prepare table data
    const tableData = completedRoutes?.map((route: Delivery, index: number) => {
      const routeWeight = route.garbage.reduce(
        (sum, item) => sum + (item.garbageId?.wasteWeight || 0),
        0
      );
      const routeRevenue = route.garbage.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );

      return [
        index + 1,
        route._id.slice(-8),
        route.truck?.truckId || "N/A",
        route.deliveryStatus,
        route.garbage?.length || 0,
        routeWeight.toFixed(2),
        routeRevenue.toFixed(2),
      ];
    });

    // Add table
    autoTable(doc, {
      startY: 65,
      head: [
        [
          "No.",
          "Route ID",
          "Truck ID",
          "Status",
          "Collections",
          "Weight (kg)",
          "Revenue (Rs)",
        ],
      ],
      body: tableData || [],
      theme: "striped",
      headStyles: {
        fillColor: [76, 175, 80],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25, halign: "center" },
        5: { cellWidth: 25, halign: "right" },
        6: { cellWidth: 30, halign: "right" },
      },
    });

    // Add detailed breakdown for each route
    let finalY = (doc as any).lastAutoTable.finalY + 10;

    completedRoutes?.forEach((route: Delivery, index: number) => {
      // Check if we need a new page
      if (finalY > 250) {
        doc.addPage();
        finalY = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Route ${index + 1} - Details`, 14, finalY);
      finalY += 7;

      const detailsData = route.garbage.map((item, idx) => [
        idx + 1,
        item.garbageId?.binId?.binId || "N/A",
        item.garbageId?.garbageCategory || "N/A",
        item.garbageId?.wasteWeight?.toFixed(2) || "0",
        item.garbageId?.binId?.location || "N/A",
        item.garbageId?.createdBy?.username || "N/A",
        item.price?.toFixed(2) || "0",
      ]);

      autoTable(doc, {
        startY: finalY,
        head: [
          ["No.", "Bin ID", "Category", "Weight (kg)", "Location", "User", "Price (Rs)"],
        ],
        body: detailsData,
        theme: "grid",
        headStyles: {
          fillColor: [33, 150, 243],
          textColor: 255,
          fontSize: 8,
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        columnStyles: {
          0: { cellWidth: 12 },
          6: { halign: "right" },
        },
      });

      finalY = (doc as any).lastAutoTable.finalY + 8;
    });

    // Save the PDF
    doc.save(`collection_history_${currentDate}.pdf`);
  };

  // Generate CSV Report
  const generateCSVReport = () => {
    let csvContent = "Route ID,Truck ID,Status,Collections,Total Weight (kg),Total Revenue (Rs),Date\n";

    completedRoutes?.forEach((route: Delivery) => {
      const routeWeight = route.garbage.reduce(
        (sum, item) => sum + (item.garbageId?.wasteWeight || 0),
        0
      );
      const routeRevenue = route.garbage.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );

      csvContent += `${route._id},`;
      csvContent += `${route.truck?.truckId || "N/A"},`;
      csvContent += `${route.deliveryStatus},`;
      csvContent += `${route.garbage?.length || 0},`;
      csvContent += `${routeWeight.toFixed(2)},`;
      csvContent += `${routeRevenue.toFixed(2)},`;
      csvContent += `${format(new Date(), "yyyy-MM-dd")}\n`;
    });

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `collection_history_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const paginatedData =
    completedRoutes?.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    ) || [];

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          padding: theme.spacing(3),
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <PageTitle title="Collection History" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>

      <Box sx={{ padding: theme.spacing(3) }}>
        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Completed Routes
                </Typography>
                <Typography variant="h4">{stats.totalRoutes}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Waste Collected
                </Typography>
                <Typography variant="h4">{stats.totalWaste} kg</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4">Rs. {stats.totalRevenue}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Export Buttons */}
        <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={generatePDFReport}
            sx={{ 
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" }
            }}
          >
            Export PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<ExcelIcon />}
            onClick={generateCSVReport}
            sx={{ 
              bgcolor: "#2e7d32",
              "&:hover": { bgcolor: "#1b5e20" }
            }}
          >
            Export CSV
          </Button>
        </Box>

        {/* Collection History Table */}
        <Stack sx={{ alignItems: "center" }}>
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              overflowX: "auto",
              maxWidth: isMobile ? "88vw" : "100%",
            }}
          >
            {isLoading && <LinearProgress sx={{ width: "100%" }} />}
            <Table>
              <TableHead sx={{ backgroundColor: "var(--eco-waste-secondary-green)" }}>
                <TableRow>
                  <TableCell />
                  <TableCell>Route ID</TableCell>
                  <TableCell>Truck ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Collections</TableCell>
                  <TableCell align="right">Total Weight (kg)</TableCell>
                  <TableCell align="right">Total Revenue (Rs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((route: Delivery) => {
                    const isExpanded = expandedRows.has(route._id);
                    const routeWeight = route.garbage.reduce(
                      (sum, item) => sum + (item.garbageId?.wasteWeight || 0),
                      0
                    );
                    const routeRevenue = route.garbage.reduce(
                      (sum, item) => sum + (item.price || 0),
                      0
                    );

                    return (
                      <>
                        <TableRow
                          key={route._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            cursor: "pointer",
                            "&:hover": { bgcolor: "#f5f5f5" },
                          }}
                        >
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => toggleRowExpansion(route._id)}
                            >
                              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>{route._id.slice(-8)}</TableCell>
                          <TableCell>{route.truck?.truckId || "N/A"}</TableCell>
                          <TableCell>
                            <Chip
                              label={route.deliveryStatus}
                              color="success"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">{route.garbage?.length || 0}</TableCell>
                          <TableCell align="right">{routeWeight.toFixed(2)}</TableCell>
                          <TableCell align="right">{routeRevenue.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={7}
                          >
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                  Collection Details
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Bin ID</TableCell>
                                      <TableCell>Category</TableCell>
                                      <TableCell>Weight (kg)</TableCell>
                                      <TableCell>Location</TableCell>
                                      <TableCell>User</TableCell>
                                      <TableCell align="right">Price (Rs)</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {route.garbage.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          {item.garbageId?.binId?.binId || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {item.garbageId?.garbageCategory || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {item.garbageId?.wasteWeight?.toFixed(2) || "0"}
                                        </TableCell>
                                        <TableCell>
                                          {item.garbageId?.binId?.location || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {item.garbageId?.createdBy?.username || "N/A"}
                                        </TableCell>
                                        <TableCell align="right">
                                          {item.price?.toFixed(2) || "0"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2">
                        No completed routes found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                    colSpan={7}
                    count={completedRoutes?.length || 0}
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
      </Box>
    </Box>
  );
}

export default CollectionHistory;
