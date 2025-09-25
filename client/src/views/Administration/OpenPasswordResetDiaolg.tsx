import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  TextField,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import ForgotPasswordDialog from "../LoginPage/ForgotPasswordDialog";
import { useState } from "react";
import { PasswordReset, User, userPasswordReset } from "../../api/userApi";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { useNavigate } from "react-router";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: User;
  onSubmit: (data: PasswordReset) => void;
  isSubmitting?: boolean;
};

export default function PasswordResetDialog({
  open,
  handleClose,
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: DialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { isMobile } = useIsMobile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PasswordReset>();

  const resetForm = () => {
    reset();
  };
  const navigate = useNavigate();

  const newPassword = watch("newPassword");
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] =
    useState(false);

  const { mutate: resetUserPasswordMutation, isPending } = useMutation({
    mutationFn: userPasswordReset,
    onSuccess: () => {
      localStorage.removeItem("token");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      enqueueSnackbar("Password Reset Successfully", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.data?.message ?? `User Role Update Failed`, {
        variant: "error",
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullWidth
      maxWidth={"sm"}
      fullScreen={isMobile}
      PaperProps={{
        style: {
          backgroundColor: grey[50],
        },
        component: "form",
      }}
    >
      <DialogTitle
        sx={{
          paddingY: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" textAlign={"center"}>
          Password Reset For {defaultValues.name}
        </Typography>
        <IconButton
          onClick={() => {
            resetForm();
            handleClose();
          }}
          sx={{ color: "#024271" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack direction="column" gap={2} mt={2}>
          <TextField
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            label="Current Password"
            type="password"
            fullWidth
            size="small"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            {...register("newPassword", {
              required: "New password is required",
            })}
            label="New Password"
            type="password"
            fullWidth
            size="small"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            {...register("newPassword_confirmation", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            label="Confirm Password"
            type="password"
            fullWidth
            size="small"
            error={!!errors.newPassword_confirmation}
            helperText={errors.newPassword_confirmation?.message}
          />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => {
            resetForm();
            handleClose();
          }}
          sx={{ color: "var(--pallet-blue)" }}
        >
          Cancel
        </Button>
        <CustomButton
          variant="text"
          sx={{
            color: "var(--pallet-orange)",
          }}
          size="medium"
          onClick={() => setOpenForgotPasswordDialog(true)}
        >
          Forgot Password
        </CustomButton>
        <CustomButton
          variant="contained"
          sx={{ backgroundColor: "var(--pallet-blue)" }}
          disabled={isPending}
          onClick={handleSubmit((data: PasswordReset) => {
            resetUserPasswordMutation(data);
          })}
        >
          Reset Password
        </CustomButton>
        <ForgotPasswordDialog
          open={openForgotPasswordDialog}
          handleClose={() => setOpenForgotPasswordDialog(false)}
        />
      </DialogActions>
    </Dialog>
  );
}
