import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import { fetchAllAssigneeLevel, User, UserRole } from "../../api/userApi";
import { getAccessRolesList } from "../../api/accessManagementApi";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: User;
  onSubmit: (data: { _id: string; userTypeId: string }) => void;
  isSubmitting?: boolean;
};

export default function EditUserRoleDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: DialogProps) {
  const { data: roles, isFetching: isFetchingRoles } = useQuery<UserRole[]>({
    queryKey: ["access-roles"],
    queryFn: getAccessRolesList,
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<User>({
    defaultValues: {
      userType: defaultValues?.userType,
      ...defaultValues,
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
  const { isMobile } = useIsMobile();

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullScreen={isMobile}
      fullWidth
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
          {defaultValues ? "Edit User Role" : "Add User Role"}
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={handleClose}
          edge="start"
          sx={{
            color: "#024271",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack direction="column" gap={1}>
          <>
            <Box sx={{ flex: 1 }}>
              <Controller
                name="userType"
                control={control}
                defaultValue={defaultValues?.userType}
                rules={{ required: true }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(_, data) => field.onChange(data)}
                    getOptionLabel={(option) => option?.userType || ""}
                    size="small"
                    options={roles || []}
                    sx={{ flex: 1, margin: "0.5rem" }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.userType}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        error={!!errors.userType}
                        label="Role"
                        name="userType"
                      />
                    )}
                  />
                )}
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
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          disabled={isSubmitting}
          size="medium"
          onClick={handleSubmit((data) => {
            onSubmit({
              _id: defaultValues?._id,
              userTypeId: data.userType?._id,
            });
          })}
        >
          {defaultValues ? "Update Changes" : "Assign Role"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
