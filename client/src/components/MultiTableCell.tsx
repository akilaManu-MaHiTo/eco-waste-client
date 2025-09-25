import React from "react";
import { TableCell } from "@mui/material";

interface MultiTableCellProps {
  row: any; // Adjust the type as per your actual data structure
  columnKey: string;
}

const MultiTableCell: React.FC<MultiTableCellProps> = ({ row, columnKey }) => {
  return (
    <TableCell align="right">
      {(() => {
        const value = row[columnKey]; // Get the value of the specific column
        try {
          // Check if value is a string that looks like JSON
          const parsedValue =
            typeof value === "string" ? JSON.parse(value) : value;

          // If it's an array, clean up quotes and join the elements with <br/>
          if (Array.isArray(parsedValue)) {
            return parsedValue.map((item, index) => (
              <div key={index}>{item.replace(/^"|"$/g, "")}</div>
            ));
          }

          return parsedValue;
        } catch (error) {
          console.error("Invalid JSON in value:", value);
          return value; // Fallback to original value if JSON parsing fails
        }
      })()}
    </TableCell>
  );
};

export default MultiTableCell;
