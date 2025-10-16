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
import { useEffect } from "react";
import useIsMobile from "../../customHooks/useIsMobile";
import CustomButton from "../../components/CustomButton";
import LocationPicker from "../../components/LocationPicker";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  binTypeData,
  createWasteBin,
  fetchWasteBins,
  updateWasteBin,
  WasteBin
} from "../../api/wasteBin";
import queryClient from "../../state/queryClient";
import { enqueueSnackbar } from "notistack";
import UserAutoComplete from "../../components/UserAutoComplete";
import SwitchButton from "../../components/SwitchButton";
import { createTruck, fetchTrucks, Truck, truckStatusData, updateTruck } from "../../api/truck";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Truck;
  onSubmit?: (data: Truck) => void;
};

export default function AddOrEditTruckDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isTablet, isMobile } = useIsMobile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<Truck>({
    defaultValues,
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

  const handleLocationChange = (latitude: number, longitude: number, address?: string) => {
    setValue("latitude", latitude);
    setValue("longitude", longitude);
    if (address) {
      setValue("currentLocation", address);
    }
  };

  const handleCreateDocument = (data: Truck) => {
    if (defaultValues) {
      data.truckId = defaultValues.truckId;
      updateTruckMutation(data);
    } else {
      createTruckMutation(data);
    }
  };



  //   const { data: divisionData, isFetching: isDivisionDataFetching } = useQuery({
  //     queryKey: ["divisions"],
  //     queryFn: fetchDivision,
  //   });

  //   const { data: userData, isFetching: isUserDataFetching } = useQuery({
  //     queryKey: ["users"],
  //     queryFn: fetchAllUsers,
  //   });

  //   const { data: asigneeData, isFetching: isAssigneeDataFetching } = useQuery({
  //     queryKey: ["medicine-assignee"],
  //     queryFn: fetchMedicineRequestAssignee,
  //   });

  const { mutate: createTruckMutation } = useMutation({
    mutationFn: createTruck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["truck-data"] });
      enqueueSnackbar("Truck Added Successfully!", {
        variant: "success",
      });
      reset();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Truck Added Failed!`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateTruckMutation } = useMutation({
    mutationFn: updateTruck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["truck-data"] });
      enqueueSnackbar("Truck Updated Successfully!", {
        variant: "success",
      });
      reset();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Truck Update Failed!`, {
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
      fullScreen={isTablet || isMobile}
      maxWidth={isTablet ? "lg" : "lg"}
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
          {defaultValues ? "Edit Truck" : "Add Truck"}
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
        <Stack
          sx={{
            display: "flex",
            flexDirection: isTablet ? "column" : "row",
            padding: "1rem",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              padding: "0.5rem",
              borderRadius: "0.3rem",
              height: "fit-content",
            }}
          >                    
            <Controller
              name="status"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  size="small"
                  options={truckStatusData?.map((status) => status.label) || []}
                  value={field.value || ""}
                  onChange={(_, value) => field.onChange(value)}
                  sx={{ flex: 1, margin: "0.5rem" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      error={!!errors.status}
                      label="Truck Status"
                    />
                  )}
                />
              )}
            />
            
            <TextField
              required
              id="capacity"
              label="Capacity (kg)"
              error={!!errors.capacity}
              size="small"
              type="number"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("capacity", { 
                required: true,
                valueAsNumber: true,
                min: { value: 1, message: "Capacity must be greater than 0" }
              })}
            />

            <LocationPicker
              latitude={watch("latitude")}
              longitude={watch("longitude")}
              onLocationChange={handleLocationChange}
              label="Truck Location"
            />           
          </Stack>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => {
            resetForm();
            handleClose();
          }}
          sx={{ color: "var(--eco-waste-blue)" }}
        >
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--eco-waste-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            handleCreateDocument(data);
          })}
        >
          {defaultValues ? "Update Truck" : "Add Truck"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
