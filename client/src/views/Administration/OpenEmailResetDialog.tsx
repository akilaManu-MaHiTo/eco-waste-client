import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  resetProfileEmail,
  resetProfileEmailConfirm,
  resetProfileEmailVerification,
  User,
} from "../../api/userApi";
import { useSnackbar } from "notistack";
import theme from "../../theme";
import queryClient from "../../state/queryClient";
import { useNavigate } from "react-router";

function ResetEmailDialog({
  open,
  handleClose,
  defaultValues,
}: {
  open: boolean;
  handleClose: () => void;
  defaultValues: User;
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const [emailDisabled, setEmailDisabled] = React.useState(false);
  const [showOTPField, setShowOTPField] = React.useState(false);
  const [showEmail, setShowEmailFields] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
    watch,
    control,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: defaultValues.email || "",
      otp: "",
      newEmail: "",
    },
  });

  const {
    mutate: resetProfileEmailMutation,
    isPending: isForgotPasswordPending,
  } = useMutation({
    mutationFn: resetProfileEmail,
    onSuccess: () => {
      enqueueSnackbar("OTP sent to your email", { variant: "success" });
      setEmailDisabled(true);
      setShowOTPField(true);
    },
    onError: () => {
      enqueueSnackbar("OTP sending failed", { variant: "error" });
    },
  });

  const {
    mutate: otpVerificationMutation,
    isPending: isOtpVerificationPending,
  } = useMutation({
    mutationFn: resetProfileEmailVerification,
    onSuccess: () => {
      enqueueSnackbar("OTP Verified Successfully", { variant: "success" });
      setShowOTPField(false);
      setShowEmailFields(true);
    },
    onError: () => {
      enqueueSnackbar("OTP Expired or Invalid", { variant: "error" });
    },
  });
  const navigate = useNavigate();

  const {
    mutate: resetEmailConfirmMutation,
    isPending: isResetPasswordPending,
  } = useMutation({
    mutationFn: resetProfileEmailConfirm,
    onSuccess: () => {
      localStorage.removeItem("token");
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      enqueueSnackbar("Email reset successful!", { variant: "success" });
      reset();
      setEmailDisabled(false);
      setShowOTPField(false);
      setShowEmailFields(false);
      handleClose();
    },
    onError: () => {
      enqueueSnackbar("Email reset failed", { variant: "error" });
    },
  });

  const onSubmit = (data: {
    email: string;
    otp?: string;
    newEmail?: string;
  }) => {
    if (!showOTPField && !showEmail) {
      resetProfileEmailMutation({
        currentEmail: data.email,
        id: defaultValues.id,
      });
    } else if (showOTPField) {
      otpVerificationMutation({ otp: data.otp, id: defaultValues.id });
    } else if (showEmail) {
      resetEmailConfirmMutation({
        newEmail: data.newEmail,
        id: defaultValues.id,
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={isMobile}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>You can Reset Your Email</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#525252" }}>
            We'll send a link to your registered email address. Click the link
            to reset your email securely.
          </Typography>

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                required
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ marginTop: "1rem" }}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={emailDisabled}
                onBlur={() => {
                  field.onBlur(); // Keep RHF state in sync
                  trigger("email"); // Validate onBlur
                }}
              />
            )}
          />

          {showOTPField && (
            <TextField
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter a valid 6-digit OTP",
                },
              })}
              autoFocus
              required
              margin="dense"
              id="otp"
              name="otp"
              label="Enter OTP"
              type="text"
              fullWidth
              variant="outlined"
              size="small"
              sx={{ marginTop: "1rem" }}
              error={!!errors.otp}
              helperText={errors.otp?.message}
            />
          )}

          {showEmail && (
            <>
              <TextField
                {...register("newEmail", {
                  required: "Email is required",
                })}
                margin="dense"
                id="newEmail"
                name="newEmail"
                label="New Email"
                type="email"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ marginTop: "1rem" }}
                error={!!errors.newEmail}
                helperText={errors.newEmail?.message}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}>
          <Button
            onClick={() => {
              setEmailDisabled(false);
              setShowOTPField(false);
              setShowEmailFields(false);
              reset();
              handleClose();
            }}
            disabled={
              isForgotPasswordPending ||
              isOtpVerificationPending ||
              isResetPasswordPending
            }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              isForgotPasswordPending ||
              isOtpVerificationPending ||
              isResetPasswordPending ||
              isSubmitting
            }
          >
            {isForgotPasswordPending || isSubmitting
              ? "Sending..."
              : showEmail
              ? "Reset Email"
              : showOTPField
              ? "Verify OTP"
              : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ResetEmailDialog;
