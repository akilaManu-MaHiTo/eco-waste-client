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
  Chip,
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
import { useEffect, useMemo, useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import {
  fetchAllUsers,
  searchUser,
  updateUserType,
  User,
} from "../../api/userApi";
import ViewUserContent from "./ViewUserContent";
import EditUserRoleDialog from "./EditUserRoleDialog";
import { PermissionKeys } from "./SectionList";
import useCurrentUserHaveAccess from "../../hooks/useCurrentUserHaveAccess";
import { useMutation, useQuery } from "@tanstack/react-query";
import { green, grey } from "@mui/material/colors";
import queryClient from "../../state/queryClient";
import SearchBar from "../../components/SearchBar";
import { useDebounce } from "../../util/useDebounce";

function UserTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<User>(null);
  const [openEditUserRoleDialog, setOpenEditUserRoleDialog] = useState(false);
  // const [userData, setUserData] = useState<User[]>(sampleUsers);
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
    { title: "Users" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 2000);

  const {
    data: searchedUserData,
    refetch: researchUser,
    isFetching: isSearchingUser,
  } = useQuery({
    queryKey: ["users", debouncedQuery],
    queryFn: ({ queryKey }) => searchUser({ query: queryKey[1] }),
  });

  // useEffect(() => {
  //   researchUser();
  // }, [debouncedQuery]);

  const handleSearch = async (query: string) => {
    console.log("Searching for:", query);
    setSearchQuery(query);
    try {
      await researchUser();
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const paginatedUsersData = useMemo(() => {
    if (!searchedUserData) return [];
    if (rowsPerPage === -1) {
      return searchedUserData;
    }
    return searchedUserData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [searchedUserData, page, rowsPerPage]);

  const { mutate: updateUserRoleMutation, isPending } = useMutation({
    mutationFn: updateUserType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpenEditUserRoleDialog(false);
      enqueueSnackbar("User Role Updated Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`User Role Update Failed`, {
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
        <PageTitle title="Users" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>

      <Box mb={2} display="flex" justifyContent="flex-end">
        <SearchBar
          placeholder="Search Users..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          isSearching={isSearchingUser}
        />
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
          {isSearchingUser && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Role</TableCell>
                <TableCell align="right">Job Position</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsersData?.length > 0 ? (
                paginatedUsersData?.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenViewDrawer(true);
                    }}
                  >
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.userType?.userType}</TableCell>
                    <TableCell align="right">
                      {row.jobPosition ?? "--"}
                    </TableCell>
                    <TableCell align="center">
                      {row.availability ? (
                        <Chip
                          label="Active"
                          sx={{
                            backgroundColor: green[100],
                            color: green[800],
                          }}
                        />
                      ) : (
                        <Chip
                          label="Inactive"
                          sx={{
                            backgroundColor: grey[100],
                            color: grey[800],
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    {isSearchingUser ? (
                      <Typography variant="body2">Looking For Users</Typography>
                    ) : (
                      <Typography variant="body2">No Users found</Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={100}
                  count={searchedUserData?.length}
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
        fullScreen={true}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="User Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenEditUserRoleDialog(true);
              }}
              disableEdit={
                !useCurrentUserHaveAccess(PermissionKeys.ADMIN_USERS_EDIT)
              }
              // onDelete={() => setDeleteDialogOpen(true)}
              // disableDelete={
              //   !useCurrentUserHaveAccess(PermissionKeys.ADMIN_USERS_DELETE)
              // }
            />

            {selectedRow && (
              <Stack>
                <ViewUserContent selectedUser={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openEditUserRoleDialog && (
        <EditUserRoleDialog
          open={openEditUserRoleDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenEditUserRoleDialog(false);
          }}
          onSubmit={(data) => {
            updateUserRoleMutation(data);
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove User Confirmation"
          content={
            <>
              Are you sure you want to remove this user?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {}}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("User Deleted Successfully!", {
              variant: "success",
            });
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

export default UserTable;
