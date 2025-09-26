import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import companyLogo from "../../assets/eco waste logo.png";
import groupLogo from "../../assets/eco waste letter.png";
import { useForm, Controller } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import LoginIcon from "@mui/icons-material/Login";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registerUser } from "../../api/userApi";
import SwitchButton from "../../components/SwitchButton";
import AutoCheckBox from "../../components/AutoCheckbox";

function RegistrationForm() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up(990));
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedFactories, setSelectedFactories] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  //API Fetch Data
  // const [departments, setDepartments] = useState<departmentSchema[]>([]);
  // const [factory, setFactory] = useState<factorySchema[]>([]);
  // const [jobPositions, setJobPositions] = useState<jobPositionSchema[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      mobileNumber: null,
      username: "",
      confirmPassword: "",
      isCompanyEmployee: false,
      jobPosition: "",
      department: "",
      assignedFactory: selectedFactories,
      employeeNumber: "",
    },
  });

  const userPassword = watch("password");

  const { mutate: registrationMutation, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      localStorage.setItem("token", data?.token);
      enqueueSnackbar("Account Created Successfully!", { variant: "success" });
      navigate("/home");
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar(error?.data?.message ?? `Registration Failed`, {
        variant: "error",
      });
    },
  });

  const onRegistrationSubmit = (data) => {
    if (data.isCompanyEmployee && data.assignedFactory.length === 0) {
      enqueueSnackbar("Please select at least one factory.", {
        variant: "error",
      });
      return;
    }
    registrationMutation(data);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        justifyContent: "center",
        margin: "2.5rem",
        marginBottom: isMdUp ? "2.5rem" : "22vh",
      }}
    >
      <Box>
        <img src={companyLogo} alt="logo" height={"65em"} />
        <img
          src={groupLogo}
          alt="logo"
          style={{ marginLeft: "1rem" }}
          height={"50rem"}
        />
      </Box>
      <Box>
        <Typography variant={"body2"}>
          Create an account to access the platform
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onRegistrationSubmit)}>
        <TextField
          required
          id="name"
          label="Name"
          error={!!errors.username}
          fullWidth
          size="small"
          sx={{ marginTop: "1rem" }}
          helperText={errors.username ? errors.username.message : ""}
          {...register("username", {
            required: {
              value: true,
              message: "Required",
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: "Name must contain only letters and spaces",
            },
          })}
        />

        <TextField
          required
          id="email"
          label="Email Address"
          placeholder="sample@company.com"
          error={!!errors.email}
          fullWidth
          type="email"
          size="small"
          sx={{ marginTop: "1rem" }}
          {...register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
            minLength: {
              value: 5,
              message: "Email must be at least 5 characters long",
            },
            maxLength: {
              value: 320,
              message: "Email cannot exceed 320 characters long",
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}
          helperText={errors.email ? errors.email.message : ""}
        />

        <TextField
          required
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          size="small"
          fullWidth
          sx={{ marginTop: "1rem" }}
          error={!!errors.password}
          {...register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
            maxLength: {
              value: 128,
              message: "Password cannot exceed 128 characters long",
            },
          })}
          helperText={errors.password ? errors.password.message : ""}
        />

        <TextField
          required
          id="confirmPassword"
          label="Confirm Password"
          type={"password"}
          size="small"
          fullWidth
          helperText={
            errors.confirmPassword ? errors.confirmPassword.message : ""
          }
          sx={{ marginTop: "1rem" }}
          error={!!errors.confirmPassword}
          {...register("confirmPassword", {
            required: {
              value: true,
              message: "Confirm Password is required",
            },
            validate: {
              matchesPreviousPassword: (value) =>
                value === userPassword || "Passwords do not match",
            },
          })}
        />

        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                size="small"
              />
            }
            label="Show Password"
            sx={{
              "& .MuiTypography-body1": {
                fontSize: "0.85rem",
              },
              marginTop: "1rem",
            }}
          />
        </Box>

        <TextField
          required
          id="mobileNumber"
          label="Mobile Number"
          type="tel"
          error={!!errors.mobileNumber}
          fullWidth
          size="small"
          sx={{ marginTop: "1rem" }}
          helperText={
            typeof errors.mobileNumber?.message === "string"
              ? errors.mobileNumber.message
              : ""
          }
          {...register("mobileNumber", {
            required: {
              value: true,
              message: "Mobile number is required",
            },
            minLength: {
              value: 6,
              message: "Mobile number must be at least 6 digits",
            },
            maxLength: {
              value: 16,
              message: "Mobile number cannot exceed 16 digits",
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Enter a valid mobile number (digits only)",
            },
          })}
        />

        <Box
          sx={{
            marginTop: "1.6rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <CustomButton
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--eco-waste-blue)",
            }}
            size="medium"
            disabled={isPending}
            startIcon={
              isPending ? (
                <CircularProgress color="inherit" size={"1rem"} />
              ) : (
                <LoginIcon />
              )
            }
          >
            Create Account
          </CustomButton>
          <CustomButton
            variant="text"
            sx={{
              color: "var(--pallet-orange)",
            }}
            size="medium"
            onClick={() => navigate("/")}
          >
            Login to an existing account
          </CustomButton>
        </Box>
      </form>
    </Stack>
  );
}

export default RegistrationForm;
