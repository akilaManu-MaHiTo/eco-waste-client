import { Box } from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

function CollectorDashboard() {
  const breadcrumbItems = [
    { title: "Waste Collection", href: "/home" },
    { title: `Collection Dashboard` },
  ];

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          padding: theme.spacing(3),
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <PageTitle title="Collector Dashboard" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>
    </Box>
  );
}

export default CollectorDashboard;
