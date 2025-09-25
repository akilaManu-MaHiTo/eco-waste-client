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
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword, otpVerification, resetPassword } from "../../api/userApi";
import { useSnackbar } from "notistack";
import theme from "../../theme";

function ForgotPasswordDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { enqueueSnackbar } = useSnackbar();
  const [emailDisabled, setEmailDisabled] = React.useState(false);
  const [showOTPField, setShowOTPField] = React.useState(false);
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
    watch,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: forgotPasswordMutation, isPending: isForgotPasswordPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      enqueueSnackbar("OTP sent to your email", { variant: "success" });
      setEmailDisabled(true);
      setShowOTPField(true);
    },
    onError: () => {
      enqueueSnackbar("OTP sending failed", { variant: "error" });
    },
  });

  const { mutate: otpVerificationMutation, isPending: isOtpVerificationPending } = useMutation({
    mutationFn: otpVerification,
    onSuccess: () => {
      enqueueSnackbar("OTP Verified Successfully", { variant: "success" });
      setShowOTPField(false);
      setShowPasswordFields(true);
    },
    onError: () => {
      enqueueSnackbar("OTP Expired or Invalid", { variant: "error" });
    },
  });

  const { mutate: resetPasswordMutation, isPending: isResetPasswordPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      enqueueSnackbar("Password reset successful!", { variant: "success" });
      reset();
      setEmailDisabled(false);
      setShowOTPField(false);
      setShowPasswordFields(false);
      handleClose();
    },
    onError: () => {
      enqueueSnackbar("Password reset failed", { variant: "error" });
    },
  });

  const onSubmit = (data: { email: string; otp?: string; password?: string; confirmPassword?: string }) => {
    if (!showOTPField && !showPasswordFields) {
      forgotPasswordMutation({ email: data.email });
    } else if (showOTPField) {
      otpVerificationMutation({ email: data.email, otp: data.otp });
    } else if (showPasswordFields) {
      resetPasswordMutation({ email: data.email, password: data.password });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={isMobile}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Don't Worry</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#525252" }}>
            We are here to help you recover your password. Enter the email associated with your account, and we'll send
            an email with instructions to reset your password.
          </Typography>

          {/* Email Input */}
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            size="small"
            sx={{ marginTop: "1rem" }}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={emailDisabled}
            onBlur={() => trigger("email")}
          />

          {/* OTP Input */}
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

          {/* Password Fields */}
          {showPasswordFields && (
            <>
              <TextField
                {...register("password", {
                  required: "Password is required",
                })}
                margin="dense"
                id="password"
                name="password"
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ marginTop: "1rem" }}
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <TextField
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
                margin="dense"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="outlined"
                size="small"
                sx={{ marginTop: "1rem" }}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}>
          <Button
            onClick={() => {
              setEmailDisabled(false);
              setShowOTPField(false);
              setShowPasswordFields(false);
              reset();
              handleClose();
            }}
            disabled={isForgotPasswordPending || isOtpVerificationPending || isResetPasswordPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isForgotPasswordPending || isOtpVerificationPending || isResetPasswordPending || isSubmitting}
          >
            {isForgotPasswordPending || isSubmitting
              ? "Submitting..."
              : showPasswordFields
              ? "Reset Password"
              : showOTPField
              ? "Verify OTP"
              : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ForgotPasswordDialog;
