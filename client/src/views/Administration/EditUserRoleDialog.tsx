import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Autocomplete,
  Box,
  CircularProgress,
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
import {
  fetchAllAssigneeLevel,
  updateUserType,
  User,
  UserLevel,
  UserRole,
} from "../../api/userApi";
import { getAccessRolesList } from "../../api/accessManagementApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";
import { useSnackbar } from "notistack";
// import { fetchDepartmentData } from "../../api/departmentApi";
// import {
//   createNewDepartment,
//   createNewJobPosition,
//   fetchJobPositionData,
// } from "../../api/jobPositionApi";
// import { fetchFactoryData } from "../../api/factoryApi";
// import { fetchResponsibleSectionData } from "../../api/responsibleSetionApi";
import AutoCheckBox from "../../components/AutoCheckbox";
import SwitchButton from "../../components/SwitchButton";
import AddIcon from "@mui/icons-material/Add";

type DialogProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues?: User;
  onSubmit: (data: {
    id: number;
    userTypeId: number;
    assigneeLevel: number;
    department: string;
    availability: boolean;
    jobPosition: string;
    assignedFactory: string[];
    responsibleSection: string[];
  }) => void;
  isSubmitting?: boolean;
};

export default function EditUserRoleDialog({
  open,
  handleClose,
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: DialogProps) {
  const { isTablet } = useIsMobile();
  const { data: roles, isFetching: isFetchingRoles } = useQuery<UserRole[]>({
    queryKey: ["access-roles"],
    queryFn: getAccessRolesList,
  });
  const { data: levels, isFetching: isFetchingLevels } = useQuery<UserLevel[]>({
    queryKey: ["access-levels"],
    queryFn: fetchAllAssigneeLevel,
  });
  // const { data: departmentData, isFetching: isDepartmentDataFetching } =
  //   useQuery({
  //     queryKey: ["departments"],
  //     queryFn: fetchDepartmentData,
  //   });
  // const { data: jobPositions, isFetched: isJobPositionsFetched } = useQuery({
  //   queryKey: ["jobPositions"],
  //   queryFn: fetchJobPositionData,
  // });
  // const { data: factories, isFetched: isFactoryFetched } = useQuery({
  //   queryKey: ["factories"],
  //   queryFn: fetchFactoryData,
  // });
  // const { data: sections, isFetched: isSectionsFetched } = useQuery({
  //   queryKey: ["sections"],
  //   queryFn: fetchResponsibleSectionData,
  // });
  const { enqueueSnackbar } = useSnackbar();

  const [addNewContactDialogOpen, setAddNewContactDialogOpen] = useState(false);
  const [addNewDepartmentDialogOpen, setAddNewDepartmentDialogOpen] =
    useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<User>({
    defaultValues: {
      userType: defaultValues?.userType,
      userLevel: defaultValues?.userLevel,
      assignedFactory: defaultValues?.assignedFactory || [],
      ...defaultValues,
    },
  });

  const [selectedFactories, setSelectedFactories] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);
  const isAvailability = watch("availability");
  const job = watch("jobPosition");

  const AddNewJobPositionDialog = () => {
    const { register, handleSubmit, watch } = useForm({
      defaultValues: {
        jobPosition: "",
      },
    });
    // const {
    //   mutate: addNewJobPositionMutation,
    //   isPending: isAddNewJobPositionMutation,
    // } = useMutation({
    //   mutationFn: createNewJobPosition,
    //   onSuccess: () => {
    //     queryClient.invalidateQueries({
    //       queryKey: ["jobPositions"],
    //     });
    //     enqueueSnackbar("Job Position Created Successfully!", {
    //       variant: "success",
    //     });
    //     reset();
    //     setAddNewContactDialogOpen(false);
    //   },
    //   onError: () => {
    //     enqueueSnackbar(`Job Position Created Failed`, {
    //       variant: "error",
    //     });
    //   },
    // });

    const handleCreateJobPosition = () => {
      const watchedJob = watch("jobPosition");
      // addNewJobPositionMutation(watchedJob);
    };

    return (
      <Dialog
        open={addNewContactDialogOpen}
        onClose={() => setAddNewContactDialogOpen(false)}
        fullScreen
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
            Add New Job Position
          </Typography>
          <IconButton
            aria-label="open drawer"
            onClick={() => setAddNewContactDialogOpen(false)}
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
              flexDirection: "column",
            }}
          >
            <TextField
              {...register("jobPosition", { required: true })}
              required
              id="jobPosition"
              label="Job Position"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setAddNewContactDialogOpen(false)}
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
            // disabled={isAddNewJobPositionMutation}
            // endIcon={
            //   isAddNewJobPositionMutation ? (
            //     <CircularProgress size={20} />
            //   ) : null
            // }
            onClick={handleSubmit(handleCreateJobPosition)}
          >
            Add Job Position
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };

  const AddNewDepartmentDialog = () => {
    const { register, handleSubmit, watch } = useForm({
      defaultValues: {
        department: "",
      },
    });
    // const {
    //   mutate: addNewDepartmentMutation,
    //   isPending: isAddNewDepartmentCreating,
    // } = useMutation({
    //   mutationFn: createNewDepartment,
    //   onSuccess: () => {
    //     queryClient.invalidateQueries({
    //       queryKey: ["departments"],
    //     });
    //     enqueueSnackbar("Department Created Successfully!", {
    //       variant: "success",
    //     });
    //     reset();
    //     setAddNewDepartmentDialogOpen(false);
    //   },
    //   onError: () => {
    //     enqueueSnackbar(`Department Created Failed`, {
    //       variant: "error",
    //     });
    //   },
    // });

    const handleCreateDepartmentType = () => {
      const watchedDepartment = watch("department");
      // addNewDepartmentMutation(watchedDepartment);
    };

    return (
      <Dialog
        open={addNewDepartmentDialogOpen}
        onClose={() => setAddNewDepartmentDialogOpen(false)}
        fullWidth
        maxWidth="sm"
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
            Add New Department
          </Typography>
          <IconButton
            aria-label="open drawer"
            onClick={() => setAddNewDepartmentDialogOpen(false)}
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
              flexDirection: "column",
            }}
          >
            <TextField
              {...register("department", { required: true })}
              required
              id="name"
              label="Department"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setAddNewDepartmentDialogOpen(false)}
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
            // disabled={isAddNewDepartmentCreating}
            // endIcon={
            //   isAddNewDepartmentCreating ? <CircularProgress size={20} /> : null
            // }
            onClick={handleSubmit(handleCreateDepartmentType)}
          >
            Add Department
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };

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

  const AddNewChemicalButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      // onClick closes the menu
      onMouseDown={() => {
        setAddNewContactDialogOpen(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new Job Position
      </Typography>
    </li>
  );
  const AddNewDepartmentButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      onMouseDown={() => {
        setAddNewDepartmentDialogOpen(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new Department
      </Typography>
    </li>
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        resetForm();
        handleClose();
      }}
      fullScreen={true}
      PaperProps={{
        style: {
          backgroundColor: grey[50],
        },
        component: "form",
      }}
    >
      <AddNewJobPositionDialog />
      <AddNewDepartmentDialog />
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
          <Box>
            <Controller
              control={control}
              name={"availability"}
              render={({ field }) => {
                return (
                  <SwitchButton
                    label="Is User Available"
                    onChange={field.onChange}
                    value={field.value}
                  />
                );
              }}
            />
          </Box>

          {isAvailability ? (
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
                        <li {...props} key={option.id}>
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

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="userLevel"
                  control={control}
                  defaultValue={defaultValues?.userLevel}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(_, data) => field.onChange(data)}
                      getOptionLabel={(option) => option?.levelName || ""}
                      size="small"
                      options={levels || []}
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.levelName}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.userLevel}
                          label="User Level"
                          name="userLevel"
                        />
                      )}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                {/* <Controller
                  name="department"
                  control={control}
                  defaultValue={defaultValues?.department ?? ""}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      value={field.value || ""}
                      size="small"
                      options={[
                        ...(departmentData?.length
                          ? departmentData.map((item) => item.department)
                          : []),
                        "$ADD_NEW_DEPARTMENT",
                      ]}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      renderOption={(props, option) =>
                        option === "$ADD_NEW_DEPARTMENT" ? (
                          <AddNewDepartmentButton {...props} />
                        ) : (
                          <li {...props} key={option}>
                            {option}
                          </li>
                        )
                      }
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.department}
                          helperText={errors.department && "Required"}
                          label="Department"
                          name="department"
                        />
                      )}
                    />
                  )}
                /> */}
              </Box>

              <Box sx={{ flex: 1 }}>
                {/* <Controller
                  name="jobPosition"
                  control={control}
                  defaultValue={defaultValues?.jobPosition ?? ""}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      onChange={(event, newValue) => field.onChange(newValue)}
                      value={field.value || ""}
                      size="small"
                      options={[
                        ...(jobPositions?.length
                          ? jobPositions.map((item) => item.jobPosition)
                          : []),
                        "$ADD_NEW_JOB_POSITION",
                      ]}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      renderOption={(props, option) =>
                        option === "$ADD_NEW_JOB_POSITION" ? (
                          <AddNewChemicalButton {...props} />
                        ) : (
                          <li {...props} key={option}>
                            {option}
                          </li>
                        )
                      }
                      sx={{ flex: 1, margin: "0.5rem" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          error={!!errors.jobPosition}
                          helperText={errors.jobPosition && "Required"}
                          label="Job Position"
                          name="jobPosition"
                        />
                      )}
                    />
                  )}
                /> */}
              </Box>

              <Box sx={{ flex: 1, margin: 1 }}>
                {/* <AutoCheckBox
                  control={control}
                  required={true}
                  name="assignedFactory"
                  label="Select Factories"
                  options={factories}
                  selectedValues={selectedFactories}
                  setSelectedValues={setSelectedFactories}
                  getOptionLabel={(option) => option.factoryName}
                  getOptionValue={(option) => option.factoryName}
                  placeholder="Choose Factories"
                  limitTags={2}
                /> */}
              </Box>

              <Box sx={{ flex: 1, margin: 1 }}>
                {/* <AutoCheckBox
                  control={control}
                  required={true}
                  name="responsibleSection"
                  label="Select Responsible Sections"
                  options={sections}
                  selectedValues={selectedSections}
                  setSelectedValues={setSelectedSections}
                  getOptionLabel={(option) => option.sectionName}
                  getOptionValue={(option) => option.sectionName}
                  placeholder="Select Sections"
                  limitTags={2}
                /> */}
              </Box>
            </>
          ) : null}
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
              id: defaultValues?.id,
              userTypeId: data.userType?.id,
              assigneeLevel: data.userLevel?.id,
              department: data.department,
              availability: data.availability,
              jobPosition: data.jobPosition,
              assignedFactory: data.assignedFactory,
              responsibleSection: data.responsibleSection,
            });
          })}
        >
          {defaultValues ? "Update Changes" : "Assign Role"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
