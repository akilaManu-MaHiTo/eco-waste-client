import { Box, Typography } from "@mui/material";

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          color: "var(--pallet-blue)",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: "var(--pallet-grey)",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default PageTitle;
