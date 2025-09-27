import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomButton from "./CustomButton";

const useStyles = makeStyles(() => ({
  approveBtn: {
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
}));

interface Props {
  open: boolean;
  title: string;
  content: any;
  approveFunc: () => Promise<void>;
  onSuccess?: () => void;
  handleReject: () => void;
  handleClose: () => void;
  approveButtonDisabled?: boolean;
  customApproveButtonText?: string;
  customApproveButtonIcon?: ReactNode;
}

const ApproveConfirmationModal = ({
  open,
  title,
  content,
  handleClose,
  approveFunc,
  handleReject,
  onSuccess = () => {},
  approveButtonDisabled,
  customApproveButtonText,
  customApproveButtonIcon,
}: Props) => {
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby={title + "-dialog"}
    >
      <DialogTitle id={title + "-dialog"}>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <CustomButton
          disabled={submitting}
          variant="text"
          onClick={() => {
            handleReject();
            handleClose();
          }}
        >
          Cancel
        </CustomButton>
        <CustomButton
          variant="contained"
          sx={{ backgroundColor: "var(--pallet-blue)" }}
          startIcon={
            customApproveButtonIcon ? (
              customApproveButtonIcon
            ) : submitting ? (
              <CircularProgress size={14} color="inherit" />
            ) : (
              <DeleteIcon />
            )
          }
          disabled={submitting || approveButtonDisabled}
          onClick={async () => {
            try {
              setSubmitting(true);
              await approveFunc();
              handleClose();
              onSuccess();
            } catch (err) {
              console.error(err);
            } finally {
              setSubmitting(false);
            }
          }}
          className={classes.approveBtn}
        >
          {customApproveButtonText
            ? customApproveButtonText
            : submitting
            ? "Processing.."
            : "Proceed"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default ApproveConfirmationModal;
