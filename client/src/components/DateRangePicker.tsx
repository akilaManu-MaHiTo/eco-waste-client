import { Box, Typography } from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import DatePickerComponent from "./DatePickerComponent";
import { useState } from "react";

function DateRangePicker({
  label,
  control,
  register,
  errors,
  year,
}: {
  label: string;
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  year?: number; // watched year
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);

  const minYearDate = new Date(year, 0, 1); // Jan 1
  const maxYearDate = new Date(year, 11, 31); // Dec 31

  return (
    <Box
      sx={{
        margin: "0.5rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Controller
        control={control}
        {...register("dateRangeFrom")}
        name="dateRangeFrom"
        render={({ field }) => (
          <DatePickerComponent
            onChange={(e) => {
              field.onChange(e);
              setStartDate(e);
            }}
            value={field.value}
            error={errors?.dateRangeFrom ? "Required" : ""}
            minDate={minYearDate}
            maxDate={maxYearDate}
          />
        )}
      />
      <Typography variant="caption" sx={{ marginX: "0.5rem" }}>
        to
      </Typography>
      <Controller
        control={control}
        {...register("dateRangeTo")}
        name="dateRangeTo"
        render={({ field }) => (
          <DatePickerComponent
            onChange={(e) => field.onChange(e)}
            value={field.value}
            error={errors?.dateRangeTo ? "Required" : ""}
            minDate={startDate ?? minYearDate}
            maxDate={maxYearDate}
          />
        )}
      />
    </Box>
  );
}

export default DateRangePicker;
