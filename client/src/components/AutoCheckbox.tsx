import React from "react";
import { Controller, Control } from "react-hook-form";
import { Autocomplete, Checkbox, TextField } from "@mui/material";

// ✅ Constrain T so `optionValueKey` must be `string | number`
interface AutocompleteCheckboxProps<T extends Record<string, any>> {
  control: Control<any>;
  name: string;
  options: T[];
  selectedValues?: any[];
  setSelectedValues?: (values: any[]) => void;
  label: string;
  placeholder?: string;
  limitTags?: number;
  required?: boolean;
  optionLabelKey?: keyof T; // ✅ Key for labels (must exist in T)
  optionValueKey?: keyof T; // ✅ Key for values (must exist in T)
  getOptionLabel?: (option: T) => string; // ✅ Optional function for labels
  getOptionValue?: (option: T) => string | number; // ✅ Optional function for values
  style?: React.CSSProperties; // ✅ Optional style prop
}

// ✅ Works with any data type while ensuring `optionValueKey` is `string | number`
const AutocompleteCheckbox = <T extends Record<string, any>>({
  control,
  name,
  options = [],
  selectedValues = [],
  setSelectedValues,
  label,
  placeholder,
  limitTags,
  required = false,
  optionLabelKey,
  optionValueKey,
  getOptionLabel,
  getOptionValue,
  style,
}: AutocompleteCheckboxProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: "Required" } : {}}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Autocomplete
          multiple
          limitTags={limitTags}
          id={name}
          options={options}
          disableCloseOnSelect
          getOptionLabel={(option) =>
            getOptionLabel
              ? getOptionLabel(option)
              : optionLabelKey && option[optionLabelKey]
              ? String(option[optionLabelKey])
              : ""
          }
          value={options.filter((option) =>
            (value || []).includes(
              getOptionValue
                ? getOptionValue(option)
                : optionValueKey && (option[optionValueKey] as string | number)
            )
          )}
          onChange={(event, newValue) => {
            const values = newValue.map((option) =>
              getOptionValue
                ? getOptionValue(option)
                : ((optionValueKey ? option[optionValueKey] : "") as
                    | string
                    | number)
            );
            onChange(values);
            setSelectedValues?.(values);
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {getOptionLabel
                ? getOptionLabel(option)
                : optionLabelKey && option[optionLabelKey]
                ? String(option[optionLabelKey])
                : ""}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              label={label}
              placeholder={placeholder}
              size="small"
              error={!!error}
              helperText={error?.message || ""}
            />
          )}
        />
      )}
    />
  );
};

export default AutocompleteCheckbox;
