import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const AutoCheckBox = ({ name, control, options = [] }) => {
  // Ensure options is always an array
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormGroup>
          {safeOptions.map((option) => (
            <FormControlLabel
              key={option}
              control={
                <Checkbox
                  {...field}
                  checked={field.value?.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(field.value || []), option]
                      : field.value.filter((val) => val !== option);
                    field.onChange(newValue);
                  }}
                />
              }
              label={option}
            />
          ))}
        </FormGroup>
      )}
    />
  );
};

export default AutoCheckBox;
