export function dateFormatter(
  inputDate: string | number | Date | null | undefined
): string {
  if (!inputDate) {
  }

  const date = new Date(inputDate);
  if (isNaN(date.getTime())) {
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const auditColors: Record<string, string> = {
  Follow_up: "#4f46e5",
  Initial: "#10b981",
  Reaudit: "#f59e0b",
  // add more known types here...
};

export const getColorForType = (type: string): string =>
  auditColors[type] || "#94a3b8"; // default color
