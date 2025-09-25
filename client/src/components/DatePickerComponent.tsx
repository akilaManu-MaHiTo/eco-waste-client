import useIsMobile from "../customHooks/useIsMobile";
import { Stack, Typography } from "@mui/material";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { grey } from "@mui/material/colors";

function DatePickerComponent({
  value,
  onChange,
  defaultValue,
  label,
  error,
  disablePast, // Accept disablePast as a prop
  disableFuture,
  minDate,
  maxDate,
  disabled,
}: {
  value: Date | null;
  onChange: (value: Date) => void;
  defaultValue?: Date;
  label?: string;
  error?: string;
  disablePast?: boolean; // Type it as a boolean
  disableFuture?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}) {
  const { isMobile } = useIsMobile();

  return (
    <Stack>
      {label && (
        <Typography
          variant="caption"
          sx={{ marginBottom: "0.1rem", color: grey[700] }}
        >
          {label}
        </Typography>
      )}
      {isMobile ? (
        <MobileDatePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          disablePast={disablePast} // Use the passed prop
          disableFuture={disableFuture}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          sx={{
            border: error ? "1px solid var(--pallet-red)" : "",
          }}
        />
      ) : (
        <DatePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          className="date-picker"
          disablePast={disablePast} // Use the passed prop
          disableFuture={disableFuture}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          sx={{
            border: error ? "1px solid var(--pallet-red)" : "",
            padding: 0,
          }}
          slotProps={{
            textField: {
              InputProps: {
                sx: {
                  height: "2.5rem",
                },
              },
            },
          }}
        />
      )}
      {error && (
        <Typography variant="caption" sx={{ color: "var(--pallet-red)" }}>
          {error}
        </Typography>
      )}
    </Stack>
  );
}

export default DatePickerComponent;
