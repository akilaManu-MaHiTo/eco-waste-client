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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useIsMobile from "../customHooks/useIsMobile";
import CustomButton from "./CustomButton";

function ViewDataDrawer({
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

export function DrawerHeader({
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
        <DrawerEditAndDeleteButtons
          onEdit={onEdit}
          onDelete={onDelete}
          disableEdit={disableEdit}
          disableDelete={disableDelete}
        />
      </Box>
    </Box>
  );
}

export function DrawerEditAndDeleteButtons({
  onEdit,
  onDelete,
  disableEdit,
  disableDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
}) {
  const { isTablet } = useIsMobile();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {onEdit && (
        <>
          {isTablet ? (
            <IconButton
              aria-label="edit"
              onClick={onEdit}
              disabled={disableEdit}
            >
              <EditIcon
                sx={{
                  color: disableEdit
                    ? "var(--pallet-grey)"
                    : "var(--pallet-blue)",
                }}
              />
            </IconButton>
          ) : (
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-blue)",
              }}
              size="medium"
              onClick={onEdit}
              startIcon={<EditIcon />}
              disabled={disableEdit}
            >
              Edit
            </CustomButton>
          )}
        </>
      )}
      {onDelete && (
        <>
          {isTablet ? (
            <IconButton
              aria-label="delete"
              onClick={onDelete}
              sx={{ marginX: 1 }}
              disabled={disableDelete}
            >
              <DeleteIcon sx={{ color: "var(--pallet-red)" }} />
            </IconButton>
          ) : (
            <CustomButton
              variant="contained"
              sx={{
                backgroundColor: "var(--pallet-red)",
                marginX: 1,
              }}
              size="medium"
              onClick={onDelete}
              startIcon={<DeleteIcon />}
              disabled={disableDelete}
            >
              Delete
            </CustomButton>
          )}
        </>
      )}
    </Box>
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

export default ViewDataDrawer;
