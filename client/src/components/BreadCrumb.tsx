import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router";

function Breadcrumb({
  breadcrumbs,
}: {
  breadcrumbs: {
    title: string;
    href?: string;
  }[];
}) {
  const navigation = useNavigate();

  return (
    <Stack spacing={1}>
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            fontSize="small"
            sx={{ color: "var(--pallet-grey)" }}
          />
        }
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          if (breadcrumb.href) {
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{ color: "var(--pallet-grey)" }}
                onClick={() => navigation(breadcrumb.href)}
                style={{ cursor: "pointer" }}
              >
                {breadcrumb.title}
              </Typography>
            );
          } else {
            return (
              <Typography
                key={index}
                sx={{ color: "var(--pallet-grey)" }}
                variant="body2"
              >
                {breadcrumb.title}
              </Typography>
            );
          }
        })}
      </Breadcrumbs>
    </Stack>
  );
}

export default Breadcrumb;
