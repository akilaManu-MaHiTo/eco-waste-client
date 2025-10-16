import { Box, Grid, Container, Typography, Stack } from "@mui/material";
import React, { useMemo } from "react";
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
import DashboardStatsCard from "../../components/DashboardStatsCard";
import { 
  Assessment, 
  AttachMoney, 
  RecyclingOutlined 
} from "@mui/icons-material";

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

  // Calculate dashboard stats using useMemo
  const dashboardStats = useMemo(() => {
    const totalRequests = requestsByStatus?.reduce((sum, status) => sum + status.count, 0) || 0;
    
    const totalRevenue = revenueByCategory?.reduce((sum, category) => sum + category.totalRevenue, 0) || 0;
    const currency = revenueByCategory?.[0]?.currency || 'LKR';
    
    const totalWaste = garbageByCategory?.reduce((sum, category) => sum + category.totalWeight, 0) || 0;

    return {
      totalRequests,
      totalRevenue,
      currency,
      totalWaste
    };
  }, [requestsByStatus, revenueByCategory, garbageByCategory]);

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

      {/* Dashboard Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardStatsCard
            title="Total Requests"
            value={dashboardStats.totalRequests}
            icon={Assessment}
            color="#1976d2"
            isLoading={isRequestsByStatusFetching}
            subtitle="All time requests"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <DashboardStatsCard
            title="Total Revenue"
            value={`${dashboardStats.totalRevenue} ${dashboardStats.currency}`}
            icon={AttachMoney}
            color="#2e7d32"
            isLoading={isRevenueByCategoryFetching}
            subtitle="Revenue generated"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <DashboardStatsCard
            title="Total Waste Collected"
            value={`${dashboardStats.totalWaste} kg`}
            icon={RecyclingOutlined}
            color="#ed6c02"
            isLoading={isGarbageByCategoryFetching}
            subtitle="Weight collected"
          />
        </Grid>
      </Grid>

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
