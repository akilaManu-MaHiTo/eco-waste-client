import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  colors,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import useIsMobile from "../../customHooks/useIsMobile";
import { updateUserProfileImage, User } from "../../api/userApi";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { enqueueSnackbar } from "notistack";
import { DrawerUpdateButtons } from "../../components/ViewProfileDataDrawer";
import UpdateUserProfile from "./UpdateUserProfileDialog";
import useCurrentUser from "../../hooks/useCurrentUser";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProfileImage from "../../components/ProfileImageComponent";
import PasswordResetDialog from "./OpenPasswordResetDiaolg";
import ResetEmailDialog from "./OpenEmailResetDialog";
import CustomButton from "../../components/CustomButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useNavigate } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";

function ViewUserContent({ selectedUser }: { selectedUser: User }) {
  const { isTablet, isMobile } = useIsMobile();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useCurrentUser();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const statusColor = selectedUser?.availability ? "#44b700" : "#f44336";

  const { mutate: profileUpdateMutation, isPending } = useMutation({
    mutationFn: updateUserProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Profile update failed", { variant: "error" });
    },
  });

  const saveImage = () => {
    if (imageFile) {
      profileUpdateMutation({ id: selectedUser.id, imageFile });
    }
  };
  const [openViewProfileDrawer, setOpenViewProfileDrawer] = useState(false);
  const [openEditUserRoleDialog, setOpenEditUserRoleDialog] = useState(false);
  const [openEditUserPasswordResetDialog, setOpenEditUserPasswordResetDialog] =
    useState(false);
  const [openEditUserEmailResetDialog, setOpenEditUserEmailResetDialog] =
    useState(false);

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        px: "1rem",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        my: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: "2rem",
        }}
        gap={2}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: statusColor,
              color: statusColor,
              boxShadow: "0 0 0 2px white",
              height: "16px",
              width: "16px",
              borderRadius: "50%",
            },
          }}
        >
          <ProfileImage
            name={selectedUser?.name}
            files={imageFile ? [imageFile] : selectedUser?.profileImage}
            fontSize="5rem"
          />
        </Badge>
        <Typography
          variant="h4"
          textAlign={"center"}
          sx={{
            fontSize: "1.5rem",
            color: "var(--pallet-dark-blue)",
          }}
        >
          {selectedUser?.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
          }}
          gap={2}
        >
          <CustomButton variant="outlined" component="label" sx={{ mt: 2 }}>
            Change Profile Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </CustomButton>

          {imageFile && (
            <CustomButton
              variant="contained"
              onClick={saveImage}
              sx={{ mt: 2, backgroundColor: "var(--pallet-blue)" }}
              disabled={isPending}
              endIcon={
                isPending && (
                  <CircularProgress size={20} sx={{ color: "gray" }} />
                )
              }
            >
              Save
            </CustomButton>
          )}
        </Box>
      </Box>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          flex: 2,
          p: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: isMobile ? "column" : "row",
            gap: 1,
            width: "100%",
            mt: 2,
            mb: 4,
          }}
        >
          <CustomButton
            variant="contained"
            sx={{ backgroundColor: "var(--pallet-blue)" }}
            size="medium"
            fullWidth={isMobile}
            onClick={() => setOpenEditUserRoleDialog(true)}
            startIcon={<EditOutlinedIcon />}
          >
            Edit My Profile
          </CustomButton>

          <CustomButton
            variant="contained"
            sx={{
              backgroundColor: "var(--pallet-orange)",
              minWidth: "10rem",
            }}
            size="medium"
            fullWidth={isMobile}
            startIcon={<LogoutIcon />}
            onClick={() => setLogoutDialogOpen(true)}
          >
            Log out
          </CustomButton>
        </Box>
        <Stack direction={isTablet ? "column" : "row"}>
          <DrawerContentItem
            label="Employee Id"
            value={selectedUser?.id}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Email"
            value={selectedUser?.email}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction={isTablet ? "column" : "row"}>
          <DrawerContentItem
            label="Full Name"
            value={selectedUser?.name}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Mobile Number"
            value={selectedUser?.mobile}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction={isTablet ? "column" : "row"}>
          <DrawerContentItem
            label="Designation"
            value={selectedUser?.jobPosition}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Gender"
            value={selectedUser?.gender}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack
          sx={{
            mt: "1rem",
          }}
        >
          <Accordion
            variant="elevation"
            sx={{
              paddingTop: 0,
              borderRadius: "8px",
              marginTop: "1rem",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              style={{
                borderBottom: `1px solid${colors.grey[100]}`,
                borderRadius: "8px",
              }}
              id="panel1a-header"
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "10px 0",
                }}
              >
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{
                    color: "var(--pallet-red)",
                  }}
                >
                  DANGER ZONE
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails style={{ paddingTop: 0 }}>
              <DrawerUpdateButtons
                onResetEmail={() => {
                  setOpenEditUserEmailResetDialog(true);
                }}
                onResetPassword={() => {
                  setOpenEditUserPasswordResetDialog(true);
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
      {openEditUserRoleDialog && (
        <UpdateUserProfile
          open={openEditUserRoleDialog}
          handleClose={() => {
            setOpenViewProfileDrawer(true);
            setOpenEditUserRoleDialog(false);
          }}
          defaultValues={user}
        />
      )}
      {openEditUserPasswordResetDialog && (
        <PasswordResetDialog
          open={openEditUserPasswordResetDialog}
          handleClose={() => {
            setOpenEditUserPasswordResetDialog(false);
            setOpenEditUserRoleDialog(false);
          }}
          onSubmit={(data) => {}}
          defaultValues={user}
        />
      )}
      {openEditUserEmailResetDialog && (
        <ResetEmailDialog
          open={openEditUserEmailResetDialog}
          handleClose={() => {
            setOpenEditUserEmailResetDialog(false);
            setOpenEditUserRoleDialog(false);
          }}
          defaultValues={user}
        />
      )}{" "}
      {logoutDialogOpen && (
        <DeleteConfirmationModal
          open={logoutDialogOpen}
          title="Log Out Confirmation"
          customDeleteButtonText="Log Out Now"
          customDeleteButtonIon={<LogoutIcon />}
          content={
            <>
              Are you sure you want to log out of the application?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                You will be logged out of the application and will need to log
                in with credentials again to access your account.
              </Alert>
            </>
          }
          handleClose={() => setLogoutDialogOpen(false)}
          deleteFunc={async () => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          onSuccess={() => {
            setLogoutDialogOpen(false);
            enqueueSnackbar("Logged Out Successfully!", {
              variant: "success",
            });
          }}
          handleReject={() => {
            setLogoutDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default ViewUserContent;
