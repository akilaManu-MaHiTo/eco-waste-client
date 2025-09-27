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
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { grey } from "@mui/material/colors";
import { useEffect } from "react";
import useIsMobile from "../../customHooks/useIsMobile";
import CustomButton from "../../components/CustomButton";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createGarbage,
  Garbage,
  garbageBinId,
  garbageCategory,
} from "../../api/garbage";
import queryClient from "../../state/queryClient";
import { enqueueSnackbar } from "notistack";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: Garbage;
  onSubmit?: (data: Garbage) => void;
};

export default function AddOrEditMedicineRequestDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
}: DialogProps) {
  const { isTablet } = useIsMobile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<Garbage>({
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

  const handleCreateDocument = (data: Garbage) => {
    if (defaultValues) {
      data._id = defaultValues._id;
      // updateChemicalRequestMutation({ data: submitData });
    } else {
      createGarbageMutation(data);
    }
  };

  //   const { data: medicineData, isFetching: isDoctorDataFetching } = useQuery({
  //     queryKey: ["medicine"],
  //     queryFn: fetchMedicineList,
  //   });

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

  const { mutate: createGarbageMutation } = useMutation({
    mutationFn: createGarbage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      enqueueSnackbar("Waste Added To Bin Successfully!", {
        variant: "success",
      });
      reset();
      handleClose();
    },
    onError: () => {
      enqueueSnackbar(`Waste Added To Bin Failed!`, {
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
      fullScreen={isTablet}
      maxWidth={isTablet ? "lg" : "md"}
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
          {defaultValues
            ? "Edit Medicine Request"
            : "Add a New Medicine Request"}
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
            <Autocomplete
              {...register("garbageCategory", { required: false })}
              size="small"
              options={
                garbageCategory?.length
                  ? garbageCategory.map((category) => category.label)
                  : []
              }
              defaultValue={defaultValues?.garbageCategory}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.garbageCategory}
                  label="Garbage Category"
                  name="garbageCategory"
                />
              )}
            />
            <TextField
              required
              id="wasteWeight"
              label="Waste Weight (kg)"
              error={!!errors.wasteWeight}
              size="small"
              sx={{ flex: 1, margin: "0.5rem" }}
              {...register("wasteWeight", { required: true })}
            />
            <Autocomplete
              {...register("garbageId", { required: true })}
              size="small"
              options={
                garbageBinId?.length ? garbageBinId.map((bin) => bin.label) : []
              }
              defaultValue={defaultValues?.garbageId}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.garbageId}
                  label="Select Your Bin"
                  name="garbageId"
                />
              )}
            />

            {/* <Box sx={{ flex: 1 }}>
              <UserAutoComplete
                name="approver"
                label="Approver"
                control={control}
                register={register}
                errors={errors}
                userData={asigneeData}
                defaultValue={defaultValues?.approver}
                required={true}
              />
            </Box> */}
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
          sx={{ color: "var(--pallet-blue)" }}
        >
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            handleCreateDocument(data);
          })}
        >
          {defaultValues ? "Update Changes" : "Save Medical Request"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
