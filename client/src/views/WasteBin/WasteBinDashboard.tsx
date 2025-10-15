import {
	Box,
	Grid,
	Skeleton,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import { format, isValid, parseISO } from "date-fns";
import React, { useMemo } from "react";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import useCurrentUser from "../../hooks/useCurrentUser";
import {
	Garbage,
	fetchGarbage,
	fetchgetCurrentGarbageLevel,
	fetchCurrentSummary,
	fetchgetGarbageTrend,
} from "../../api/garbage";
import { useQuery } from "@tanstack/react-query";
import { CurrentLevelCard, LastCollectionCard, NextCollectionCard, WasteCategoriesCard } from "./components/SummaryCards";
import TrendChartCard from "./components/TrendChartCard";
import PieChartCard from "./components/PieChartCard";
import CollectionHistory from "./components/CollectionHistory";
import BinUtilization from "./components/BinUtilization";
import UserCategoryList from "./components/UserCategoryList";

type TrendChartPoint = {
	date: string;
	totalWeight: number;
};

type CategoryBreakdown = {
	category: string;
	totalWeight: number;
	percent: number;
	count: number;
};

// API response shapes (based on samples provided)
type GarbageTrendCategory = {
	category: string;
	bin?: string;
	totalWeight: number;
	count: number;
};

type GarbageTrendDay = {
	date: string; // YYYY-MM-DD
	categories: GarbageTrendCategory[];
};

type GarbageTrendResponse = {
	startDate?: string;
	endDate?: string;
	trend: GarbageTrendDay[];
};

type GarbageLevelBin = {
	binId: string;
	binName?: string | null;
	totalWeight: number;
	capacity: number;
	percentFilled: number;
	deposits?: number;
};

type GarbageLevelResponse = {
	overall: {
		totalWeight: number;
		totalCapacity: number;
		percentFilled: number;
	};
	bins: GarbageLevelBin[];
};

type GarbageSummaryItem = {
	totalWeight: number;
	count: number;
	user?: { _id: string; email?: string };
	category: string;
};

const breadcrumbItems = [
	{ title: "Home", href: "/home" },
	{ title: "Waste Management" },
	{ title: "Dashboard" },
];

const WasteBinDashboard: React.FC = () => {
	const theme = useTheme();

	const { user, status: userStatus } = useCurrentUser();

	const {
		data: levelData,
		isLoading: isLevelLoading,
		isError: isLevelError,
	} = useQuery<GarbageLevelResponse>({
		queryKey: ["garbage-level"],
		queryFn: () => fetchgetCurrentGarbageLevel(),
		staleTime: 60_000,
	});

	const {
		data: summaryData,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
	} = useQuery<GarbageSummaryItem[]>({
		queryKey: ["garbage-summary"],
		queryFn: () => fetchCurrentSummary(),
		staleTime: 60_000,
	});

	const {
		data: trendData,
		isLoading: isTrendLoading,
		isError: isTrendError,
	} = useQuery<GarbageTrendResponse>({
		queryKey: ["garbage-trend"],
		queryFn: () => fetchgetGarbageTrend(),
		staleTime: 60_000,
	});

	const {
		data: historyData,
		isLoading: isHistoryLoading,
		isError: isHistoryError,
	} = useQuery<Garbage[]>({
		queryKey: ["garbage-history"],
		queryFn: () => fetchGarbage(),
		staleTime: 30_000,
	});

	const categoryBreakdown = useMemo<CategoryBreakdown[]>(() => {
		if (!summaryData || summaryData.length === 0) return [];

		const categoryTotals = summaryData.reduce<Record<string, { weight: number; count: number }>>(
			(acc, entry) => {
				const category = entry.category || "Uncategorized";
				const previous = acc[category] ?? { weight: 0, count: 0 };
				return {
					...acc,
					[category]: {
						weight: previous.weight + (entry.totalWeight ?? 0),
						count: previous.count + (entry.count ?? 0),
					},
				};
			},
			{}
		);

		const grandTotal = Object.values(categoryTotals).reduce(
			(sum, value) => sum + value.weight,
			0
		);

		if (grandTotal === 0) return [];

		return Object.entries(categoryTotals)
			.map(([category, value]) => ({
				category,
				totalWeight: value.weight,
				count: value.count,
				percent: (value.weight / grandTotal) * 100,
			}))
			.sort((a, b) => b.percent - a.percent);
	}, [summaryData]);

	const trendChartData = useMemo<TrendChartPoint[]>(() => {
		if (!trendData?.trend?.length) return [];

		return trendData.trend.map((day) => ({
			date: day.date,
			totalWeight: day.categories.reduce((sum, entry) => sum + (entry.totalWeight ?? 0), 0),
		}));
	}, [trendData]);

	const sortedHistory = useMemo<Garbage[]>(() => {
		if (!historyData?.length) return [];

		return [...historyData].sort((a, b) => {
			const dateA = new Date(a.createdAt as string).getTime();
			const dateB = new Date(b.createdAt as string).getTime();
			return dateB - dateA;
		});
	}, [historyData]);

	const lastCollected = useMemo(() => {
		return sortedHistory.find(
			(entry) => entry.status?.toLowerCase() === "collected"
		);
	}, [sortedHistory]);

		const nextCollection = useMemo(() => {
		const upcoming = sortedHistory.filter(
			(entry) => entry.status && entry.status.toLowerCase() !== "collected"
		);
			return upcoming.length > 0 ? upcoming[0] : undefined;
	}, [sortedHistory]);

	const historyPreview = useMemo(() => {
		return sortedHistory.slice(0, 6);
	}, [sortedHistory]);

	const overallPercentFilled = levelData?.overall?.percentFilled ?? 0;

	const pieChartData = useMemo(
		() =>
			categoryBreakdown.map((item) => ({
				name: item.category,
				value: Number(item.totalWeight?.toFixed(2)),
			})),
		[categoryBreakdown]
	);

	const formatDate = (value?: string | Date, fallback = "Not available") => {
		if (!value) return fallback;
		const dateInstance = typeof value === "string" ? parseISO(value) : value;
		if (!isValid(dateInstance)) return fallback;
		return format(dateInstance, "MMMM d, yyyy");
	};

	const formatTime = (value?: string | Date, fallback = "--") => {
		if (!value) return fallback;
		const dateInstance = typeof value === "string" ? parseISO(value) : value;
		if (!isValid(dateInstance)) return fallback;
		return format(dateInstance, "p");
	};

	return (
		<Stack spacing={3} sx={{ padding: theme.spacing(2) }}>
			<Box
				sx={{
					padding: theme.spacing(2),
					boxShadow: 2,
					borderRadius: 1,
					backgroundColor: "#fff",
				}}
			>
				<Stack direction="row" justifyContent="space-between" alignItems="center">
					<Stack>
						<PageTitle title="Waste Management Dashboard" />
						<Breadcrumb breadcrumbs={breadcrumbItems} />
					</Stack>
					{/* Current user info */}
					{userStatus === "loading" ? (
						<Skeleton variant="text" width={160} />
					) : user ? (
						<Typography variant="body2" color="text.secondary">
							Signed in as {user.email ?? user._id}
						</Typography>
					) : (
						<Typography variant="body2" color="text.secondary">
							Not signed in
						</Typography>
					)}
				</Stack>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<CurrentLevelCard loading={isLevelLoading} error={isLevelError} overallPercentFilled={overallPercentFilled} />
				</Grid>

				<Grid item xs={12} md={3}>
					<LastCollectionCard loading={isHistoryLoading} error={isHistoryError} lastCollected={lastCollected} formatDate={formatDate} formatTime={formatTime} />
				</Grid>

				<Grid item xs={12} md={3}>
					<NextCollectionCard loading={isHistoryLoading} error={isHistoryError} nextCollection={nextCollection} formatDate={formatDate} formatTime={formatTime} />
				</Grid>

				<Grid item xs={12} md={3}>
					<WasteCategoriesCard loading={isSummaryLoading} error={isSummaryError} categoryBreakdown={categoryBreakdown} />
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid item xs={12} md={7}>
					<TrendChartCard loading={isTrendLoading} error={isTrendError} trendChartData={trendChartData} startDate={trendData?.startDate} endDate={trendData?.endDate} theme={theme} />
				</Grid>

				<Grid item xs={12} md={5}>
					<PieChartCard loading={isSummaryLoading} error={isSummaryError} pieChartData={pieChartData} />
				</Grid>
			</Grid>

			<CollectionHistory loading={isHistoryLoading} error={isHistoryError} historyPreview={historyPreview} formatDate={formatDate} formatTime={formatTime} />
			
			<Grid container spacing={3}>

				<Grid item xs={12} md={3}>
					<UserCategoryList items={summaryData} />
				</Grid>

				<Grid item xs={12} md={3}>
					<BinUtilization loading={isLevelLoading} error={isLevelError} levelData={levelData} />

			
				</Grid>
			</Grid>
			
		</Stack>
	);
};

export default WasteBinDashboard;
