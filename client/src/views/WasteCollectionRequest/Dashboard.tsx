import { Box, Grid, Container, Typography, Stack } from "@mui/material";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGarbageByCategory,
  fetchRequestsByStatus,
  fetchWasteByBinType,
  fetchDailyCollections,
  fetchRevenueByCategory,
  fetchMonthlyRequests,
  fetchDailyRequestsByDateAndTime,
} from "../../api/garbageRequestApi";
import {
  GarbageByCategoryChart,
  RequestsByStatusChart,
  WasteByBinTypeChart,
  DailyCollectionsChart,
  RevenueByCategoryChart,
  MonthlyRequestsChart,
  DailyRequestsChart,
} from "./Charts";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";

export default function Dashboard() {
  const { data: garbageByCategory, isFetching: isGarbageByCategoryFetching } =
    useQuery({
      queryKey: ["dashboard", "garbage-by-category"],
      queryFn: fetchGarbageByCategory,
    });

  const { data: requestsByStatus, isFetching: isRequestsByStatusFetching } =
    useQuery({
      queryKey: ["dashboard", "requests-by-status"],
      queryFn: fetchRequestsByStatus,
    });

  const { data: wasteByBinType, isFetching: isWasteByBinTypeFetching } =
    useQuery({
      queryKey: ["dashboard", "waste-by-bin-type"],
      queryFn: fetchWasteByBinType,
    });

  const { data: dailyCollections, isFetching: isDailyCollectionsFetching } =
    useQuery({
      queryKey: ["dashboard", "daily-collections"],
      queryFn: fetchDailyCollections,
    });

  const { data: revenueByCategory, isFetching: isRevenueByCategoryFetching } =
    useQuery({
      queryKey: ["dashboard", "revenue-by-category"],
      queryFn: fetchRevenueByCategory,
    });

  const { data: monthlyRequests, isFetching: isMonthlyRequestsFetching } =
    useQuery({
      queryKey: ["dashboard", "monthly-requests"],
      queryFn: fetchMonthlyRequests,
    });

  const { data: dailyRequests, isFetching: isDailyRequestsFetching } = useQuery(
    {
      queryKey: ["dashboard", "daily-requests"],
      queryFn: fetchDailyRequestsByDateAndTime,
    }
  );

  return (
    <Stack>
      <Box sx={{ p: 2, boxShadow: 2, borderRadius: 1, overflowX: "hidden",mb:5 }}>
        <PageTitle title="Waste Collection" />
        <Breadcrumb
          breadcrumbs={[
            { title: "Home", href: "/home" },
            { title: "Waste Collection Dashboard" },
          ]}
        />
      </Box>

      <Grid container spacing={3}>
        {/* First Row - Pie Charts */}
        <Grid item xs={12} md={6}>
          <GarbageByCategoryChart
            data={garbageByCategory}
            isLoading={isGarbageByCategoryFetching}
          />
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <WasteByBinTypeChart
            data={wasteByBinType}
            isLoading={isWasteByBinTypeFetching}
          />
        </Grid> */}

        {/* Second Row - Bar and Revenue Charts */}
        <Grid item xs={12} md={6}>
          <RequestsByStatusChart
            data={requestsByStatus}
            isLoading={isRequestsByStatusFetching}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RevenueByCategoryChart
            data={revenueByCategory}
            isLoading={isRevenueByCategoryFetching}
          />
        </Grid>

        {/* Third Row - Line Charts */}
        <Grid item xs={12} md={6}>
          <DailyCollectionsChart
            data={dailyCollections}
            isLoading={isDailyCollectionsFetching}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DailyRequestsChart
            data={dailyRequests}
            isLoading={isDailyRequestsFetching}
          />
        </Grid>

        {/* Fourth Row - Monthly Requests (Full Width) */}
        <Grid item xs={12} md={6}>
          <MonthlyRequestsChart
            data={monthlyRequests}
            isLoading={isMonthlyRequestsFetching}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
