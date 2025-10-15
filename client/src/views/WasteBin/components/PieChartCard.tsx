import React from "react";
import { Paper, Skeleton, Typography } from "@mui/material";
import CustomPieChart from "../../../components/CustomPieChart";

const PieChartCard = ({ loading, error, pieChartData }: any) => {
  return (
    <Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
      <Typography variant="h6" mb={2}>Waste Distribution</Typography>
      {loading && <Skeleton variant="rectangular" height={260} />}
      {error && (
        <Typography variant="body2" color="error">Unable to load distribution breakdown.</Typography>
      )}
      {!loading && !error && pieChartData?.length === 0 && (
        <Typography variant="body2" color="text.secondary">No distribution data available yet.</Typography>
      )}
      {!loading && !error && pieChartData?.length > 0 && (
        <CustomPieChart data={pieChartData} height={260} width="100%" innerRadius={70} outerRadius={110} centerLabel="kg" />
      )}
    </Paper>
  );
};

export default PieChartCard;
