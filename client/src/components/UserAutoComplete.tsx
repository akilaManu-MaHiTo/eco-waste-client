import { Autocomplete, SxProps, TextField, Theme } from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { User } from "../api/userApi";

function UserAutoComplete({
  name,
  label,
  control,
  register,
  errors,
  userData,
  defaultValue,
  required,
  style,
}: {
  name: string;
  label: string;
  control: Control;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  userData: User[] | null;
  defaultValue?: User;
  required?: boolean;
  style?: SxProps<Theme>;
}) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? null}
      {...register(`${name}`, { required })}
      render={({ field }) => (
        <Autocomplete
          size="small"
          options={userData && Array.isArray(userData) ? userData : []}
          sx={{ flex: 1, margin: "0.5rem", ...style }}
          defaultValue={defaultValue}
          getOptionLabel={(option) => option?.name || ""}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              error={!!errors[name]}
              helperText={errors[name] ? "Required" : ""}
              label={label}
              name={name}
            />
          )}
          onChange={(_, data) => field.onChange(data)}
        />
      )}
    />
  );
}

export default UserAutoComplete;
