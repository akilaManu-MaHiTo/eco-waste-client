import { Box } from "@mui/material";
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

  return <Box>Dashboard</Box>;
}
