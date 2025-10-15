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
  LinearProgress,
  Stack,
  TableFooter,
  TablePagination,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useMemo, useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import { useSnackbar } from "notistack";
import ViewRequestBinContent from "../BinRequest/ViewRequestBinContent";
import { PermissionKeys } from "../Administration/SectionList";
import { useQuery } from "@tanstack/react-query";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { fetchWasteBins, WasteBin } from "../../api/wasteBin";

function BinRequestTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<WasteBin | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    { title: "Waste Management" },
    { title: "Bin Request" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: wasteBinData, isFetching: isWasteBinDataFetching } = useQuery({
    queryKey: ["wasteBin"],
    queryFn: fetchWasteBins,
  });

  console.log("wasteBinData", wasteBinData);

  const paginatedData = useMemo(() => {
    if (!wasteBinData) return [];
    if (rowsPerPage === -1) {
      return wasteBinData;
    }
    return wasteBinData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [wasteBinData, page, rowsPerPage]);

  const isBinRequestViewDisabled = !useCurrentUserHaveAccess(
    PermissionKeys.BIN_REQUEST_VIEW
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
        <PageTitle title="Bin Request" />
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
          {isWasteBinDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="bin request table">
            <TableHead
              sx={{ backgroundColor: "var(--eco-waste-secondary-green)" }}
            >
              <TableRow>
                <TableCell align="left">Bin ID</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Current Waste Level (%)</TableCell>
                <TableCell align="left">Threshold Level (%)</TableCell>
                <TableCell align="left">Bin Type</TableCell>
                <TableCell align="left">Availability</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData?.length > 0 ? (
                paginatedData?.map((row) => (
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
                    <TableCell align="left">{row.location}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.currentWasteLevel}%
                    </TableCell>
                    <TableCell align="left">{row.thresholdLevel}%</TableCell>
                    <TableCell align="left">{row.binType}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={row.availability ? "Available" : "Unavailable"}
                        color={row.availability ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "var(--eco-waste-blue)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          enqueueSnackbar(
                            "Request functionality coming soon!",
                            {
                              variant: "info",
                            }
                          );
                        }}
                      >
                        Request
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2">No Bins found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={7}
                  count={wasteBinData?.length || 0}
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
              title="Bin Details"
              handleClose={() => setOpenViewDrawer(false)}
              disableEdit={true}
              disableDelete={true}
            />

            {selectedRow && (
              <Stack>
                <ViewRequestBinContent
                  wasteBin={selectedRow}
                  onClose={() => {
                    setOpenViewDrawer(false);
                    setSelectedRow(null);
                  }}
                />
              </Stack>
            )}
          </Stack>
        }
      />
    </Stack>
  );
}

export default BinRequestTable;
