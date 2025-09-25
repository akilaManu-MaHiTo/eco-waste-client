import useIsMobile from "../customHooks/useIsMobile";
import { Stack, Typography } from "@mui/material";
import { MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
import { grey } from "@mui/material/colors";

function TimePickerComponent({
  value,
  onChange,
  defaultValue,
  label,
  error,
}: {
  value: Date | null;
  onChange: (value: Date) => void;
  defaultValue?: Date;
  label?: string;
  error?: string;
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
        <MobileTimePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          sx={{
            border: error ? "1px solid var(--pallet-red)" : "",
          }}
        />
      ) : (
        <TimePicker
          value={value}
          onChange={onChange}
          defaultValue={defaultValue}
          className="date-picker"
          timeSteps={{ minutes: 1 }}
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

export default TimePickerComponent;
