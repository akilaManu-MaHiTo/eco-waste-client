import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import { updateUserProfileDetails, User } from "../../api/userApi";
import queryClient from "../../state/queryClient";
import { genderOptions } from "../../constants/accidentConstants";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: User;
};

export default function UpdateUserProfile({
  open,
  handleClose,
  defaultValues,
}: DialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { isMobile } = useIsMobile();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    register,
    setValue,
  } = useForm<User>({
    defaultValues: {
      ...defaultValues,
    },
  });

  const { mutate: profileUpdateMutation, isPending } = useMutation({
    mutationFn: updateUserProfileDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
      handleClose();
    },
    onError: () => {
      enqueueSnackbar("Profile update failed", { variant: "error" });
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  const resetForm = () => {
    reset();
  };

  const onSubmitForm = (data: User) => {
    profileUpdateMutation({
      id: data._id!,
      name: data.username!,
      mobile: data.mobile,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullWidth
      fullScreen={isMobile}
      maxWidth={"sm"}
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
        <Typography variant="h6" component="div">
          Update User Profile
        </Typography>
        <IconButton
          onClick={handleClose}
          edge="start"
          sx={{ color: "#024271" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack direction="column" gap={1}>
          <>
            <Box sx={{ display: "flex" }}>
              <TextField
                id="name"
                type="text"
                label="Full Name"
                required
                error={!!errors.username}
                helperText={errors.username ? "Required *" : ""}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("username", { required: true })}
              />
            </Box>

            <Box sx={{ display: "flex" }}>
              <TextField
                id="mobile"
                type="text"
                label="Mobile Number"
                required
                error={!!errors.mobile}
                helperText={errors.mobile ? "Required *" : ""}
                size="small"
                sx={{ flex: 1, margin: "0.5rem" }}
                {...register("mobile", { required: true })}
              />
            </Box>
          </>
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
          variant="contained"
          sx={{ backgroundColor: "var(--pallet-blue)" }}
          disabled={isPending}
          size="medium"
          onClick={handleSubmit(onSubmitForm)}
        >
          {defaultValues ? "Update Changes" : "Assign Role"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
