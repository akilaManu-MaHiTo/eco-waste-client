import { Box } from "@mui/material";
import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

function ReviewStars({
  getRating,
  defaultRating,
}: {
  getRating?: (value: number) => void;
  defaultRating?: number;
}) {
  const [rating, setRating] = useState(defaultRating || 1);
  return (
    <Box>
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          onClick={() => {
            if (getRating) {
              setRating(index + 1);
              getRating(index + 1);
            }
          }}
          sx={{
            display: "inline-block",
            cursor: getRating ? "pointer" : "default",
            margin: "0 4px",
          }}
        >
          {index < rating ? (
            <StarIcon
              sx={{ fontSize: "2.5rem", color: "var(--pallet-blue)" }}
            />
          ) : (
            <StarOutlineIcon color="action" sx={{ fontSize: "2.5rem" }} />
          )}
        </Box>
      ))}
    </Box>
  );
}

export default ReviewStars;
