import {
  Box,
  Drawer,
  IconButton,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useIsMobile from "../customHooks/useIsMobile";
import CustomButton from "./CustomButton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";

function ViewProfileDataDrawer({
  open,
  handleClose,
  drawerContent,
  fullScreen,
}: {
  open: boolean;
  handleClose: () => void;
  drawerContent: React.ReactNode;
  fullScreen?: boolean;
}) {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  return (
    <Drawer
      anchor={"right"}
      open={open}
      onClose={handleClose}
      sx={{ zIndex: 1300 }}
      PaperProps={{
        sx: {
          width: isMobile || fullScreen ? "100vw" : "30vw",
          padding: 2,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export function DrawerProfileHeader({
  title,
  handleClose,
  onEdit,
  onDelete,
  disableEdit,
  disableDelete,
}: {
  title: string;
  handleClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
}) {
  return (
    <Box
      sx={{
        marginX: 2,
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}>
        <IconButton aria-label="delete" onClick={handleClose}>
          <CloseIcon sx={{ color: "var(--pallet-light-grey)" }} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">{title}</Typography>
      </Box>
    </Box>
  );
}

export function DrawerUpdateButtons({
  onResetEmail,
  onResetPassword,
}: {
  onResetEmail: () => void;
  onResetPassword: () => void;
}) {
  const { isMobile } = useIsMobile();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          marginTop: 2,
        }}
      >
        {onResetPassword && (
          <Box>
            <CustomButton
              variant="contained"
              sx={{ backgroundColor: "var(--pallet-blue)" }}
              size="medium"
              fullWidth={isMobile}
              startIcon={<VpnKeyOutlinedIcon />}
              onClick={onResetPassword}
            >
              Reset Password
            </CustomButton>
          </Box>
        )}

        {onResetEmail && (
          <Box>
            <CustomButton
              variant="contained"
              sx={{ backgroundColor: "var(--pallet-blue)" }}
              size="medium"
              fullWidth={isMobile}
              onClick={onResetEmail}
              startIcon={<EmailOutlinedIcon />}
            >
              Reset Email
            </CustomButton>
          </Box>
        )}
      </Box>
    </>
  );
}

export function DrawerContentItem({
  label,
  value,
  isRichText,
  sx,
}: {
  label: string;
  value?: string | number;
  isRichText?: boolean;
  sx?: SxProps;
}) {
  return (
    <Box
      sx={{
        ...sx,
        paddingY: "0.3rem",
        paddingX: "0.5rem",
        minWidth: "8rem",
      }}
    >
      <Typography
        variant="caption"
        sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
      >
        {label}
      </Typography>
      {isRichText ? (
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: value ?? "--" }}
        />
      ) : (
        <Typography variant="body2">{value ?? "--"}</Typography>
      )}
    </Box>
  );
}

export default ViewProfileDataDrawer;
