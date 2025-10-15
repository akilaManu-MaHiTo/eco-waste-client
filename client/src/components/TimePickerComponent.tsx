import useIsMobile from "../customHooks/useIsMobile";
import { Stack, Typography } from "@mui/material";
import { MobileTimePicker, TimePicker } from "@mui/x-date-pickers";
import { grey } from "@mui/material/colors";
import dayjs from "dayjs";
function TimePickerComponent({
  value,
  onChange,
  defaultValue,
  label,
  error,
  date,
}: {
  value: Date | null;
  onChange: (value: Date) => void;
  defaultValue?: Date;
  label?: string;
  error?: string;
  date?: Date;
}) {
  const { isMobile } = useIsMobile();
  const dateEqualsToday =
    date && new Date(date).toDateString() === new Date().toDateString();
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
          disablePast={dateEqualsToday ? true : false}
          shouldDisableTime={(timeValue, clockType) => {
            if (clockType === "hours" && timeValue) {
              const hour = dayjs(timeValue).hour();
              return hour >= 20 || hour < 8;
            }
            return false;
          }}
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
          disablePast={dateEqualsToday ? true : false}
          shouldDisableTime={(timeValue, clockType) => {
            if (clockType === "hours" && timeValue) {
              const hour = dayjs(timeValue).hour();
              return hour >= 20 || hour < 8;
            }
            return false;
          }}
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
