import {
	Box,
		Chip,
	Grid,
	LinearProgress,
	Paper,
	Skeleton,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme,
} from "@mui/material";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, isValid, parseISO } from "date-fns";
import React, { useMemo } from "react";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import {
	fetchGarbage,
	fetchGarbageLevel,
	fetchGarbageSummary,
	fetchGarbageTrend,
	Garbage,
	GarbageLevelResponse,
	GarbageSummaryItem,
	GarbageTrendResponse,
} from "../../api/garbage";
import { useQuery } from "@tanstack/react-query";
import CustomPieChart from "../../components/CustomPieChart";
import { CircularProgressWithLabel } from "../../components/CircularProgressWithLabel";

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

const breadcrumbItems = [
	{ title: "Home", href: "/home" },
	{ title: "Waste Management" },
	{ title: "Dashboard" },
];

const WasteBinDashboard: React.FC = () => {
	const theme = useTheme();

	const {
		data: levelData,
		isLoading: isLevelLoading,
		isError: isLevelError,
	} = useQuery<GarbageLevelResponse>({
		queryKey: ["garbage-level"],
		queryFn: () => fetchGarbageLevel(),
		staleTime: 60_000,
	});

	const {
		data: summaryData,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
	} = useQuery<GarbageSummaryItem[]>({
		queryKey: ["garbage-summary"],
		queryFn: () => fetchGarbageSummary(),
		staleTime: 60_000,
	});

	const {
		data: trendData,
		isLoading: isTrendLoading,
		isError: isTrendError,
	} = useQuery<GarbageTrendResponse>({
		queryKey: ["garbage-trend"],
		queryFn: () => fetchGarbageTrend(),
		staleTime: 60_000,
	});

	const {
		data: historyData,
		isLoading: isHistoryLoading,
		isError: isHistoryError,
	} = useQuery<Garbage[]>({
		queryKey: ["garbage-history"],
		queryFn: fetchGarbage,
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

	const renderCardHeader = (title: string) => (
		<Typography variant="subtitle2" color="text.secondary">
			{title}
		</Typography>
	);

	const renderLoader = (active = true) =>
		active ? <LinearProgress color="primary" sx={{ mt: 1 }} /> : null;

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
				<PageTitle title="Waste Management Dashboard" />
				<Breadcrumb breadcrumbs={breadcrumbItems} />
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12} md={3}>
					<Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
						{renderCardHeader("Current Garbage Level")}
						{isLevelLoading && renderLoader(true)}
						{isLevelError && (
							<Typography variant="body2" color="error" sx={{ mt: 2 }}>
								Unable to load current garbage level.
							</Typography>
						)}
						{!isLevelLoading && !isLevelError && (
							<Stack spacing={2} sx={{ mt: 2 }}>
								<CircularProgressWithLabel value={overallPercentFilled} />
								<Stack spacing={0.5}>
									<Typography variant="h5" sx={{ fontWeight: 600 }}>
										{overallPercentFilled.toFixed(0)}%
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Container is {overallPercentFilled.toFixed(0)}% full.
									</Typography>
								</Stack>
							</Stack>
						)}
					</Paper>
				</Grid>

				<Grid item xs={12} md={3}>
					<Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
						{renderCardHeader("Last Collection")}
						{isHistoryLoading && renderLoader(true)}
						{isHistoryError && (
							<Typography variant="body2" color="error" sx={{ mt: 2 }}>
								Unable to load collection history.
							</Typography>
						)}
						{!isHistoryLoading && !isHistoryError && (
							<Stack spacing={1.5} sx={{ mt: 2 }}>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{formatDate(lastCollected?.createdAt as string)}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{formatTime(lastCollected?.createdAt as string)}
								</Typography>
								{!lastCollected && (
									<Typography variant="body2" color="text.secondary">
										No collection events recorded yet.
									</Typography>
								)}
							</Stack>
						)}
					</Paper>
				</Grid>

				<Grid item xs={12} md={3}>
					<Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
						{renderCardHeader("Next Collection")}
						{isHistoryLoading && renderLoader(true)}
						{isHistoryError && (
							<Typography variant="body2" color="error" sx={{ mt: 2 }}>
								Unable to load upcoming collections.
							</Typography>
						)}
						{!isHistoryLoading && !isHistoryError && (
							<Stack spacing={1.5} sx={{ mt: 2 }}>
								<Typography variant="h5" sx={{ fontWeight: 600 }}>
									{formatDate(nextCollection?.createdAt as string, "Not scheduled")}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{formatTime(nextCollection?.createdAt as string, "--")}
								</Typography>
								{nextCollection && nextCollection.status && (
									<Chip
										size="small"
										label={nextCollection.status}
										sx={{ alignSelf: "flex-start" }}
									/>
								)}
								{!nextCollection && (
									<Typography variant="body2" color="text.secondary">
										No upcoming collection requests.
									</Typography>
								)}
							</Stack>
						)}
					</Paper>
				</Grid>

				<Grid item xs={12} md={3}>
					<Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
						{renderCardHeader("Waste Categories")}
						{isSummaryLoading && renderLoader(true)}
						{isSummaryError && (
							<Typography variant="body2" color="error" sx={{ mt: 2 }}>
								Unable to load category summary.
							</Typography>
						)}
						{!isSummaryLoading && !isSummaryError && categoryBreakdown.length === 0 && (
							<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
								No waste categories logged yet.
							</Typography>
						)}
						{!isSummaryLoading && !isSummaryError && categoryBreakdown.length > 0 && (
							<Stack spacing={1.5} sx={{ mt: 2 }}>
								{categoryBreakdown.slice(0, 4).map((item) => (
									<Box key={item.category}>
										<Stack direction="row" justifyContent="space-between" alignItems="center">
											<Typography variant="body2" sx={{ fontWeight: 500 }}>
												{item.category}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{item.percent.toFixed(0)}%
											</Typography>
										</Stack>
										<LinearProgress
											variant="determinate"
											value={Math.min(100, item.percent)}
											sx={{ mt: 0.5, height: 6, borderRadius: 9999 }}
										/>
									</Box>
								))}
							</Stack>
						)}
					</Paper>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid item xs={12} md={7}>
					<Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
						<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
							<Typography variant="h6">Waste Generation Trend</Typography>
							{trendData?.startDate && trendData?.endDate && (
								<Typography variant="caption" color="text.secondary">
									{`${trendData.startDate} - ${trendData.endDate}`}
								</Typography>
							)}
						</Stack>
						{isTrendLoading && <Skeleton variant="rectangular" height={260} />}
						{isTrendError && (
							<Typography variant="body2" color="error">
								Unable to load trend data.
							</Typography>
						)}
						{!isTrendLoading && !isTrendError && trendChartData.length === 0 && (
							<Typography variant="body2" color="text.secondary">
								No waste generation data found for the selected period.
							</Typography>
						)}
						{!isTrendLoading && !isTrendError && trendChartData.length > 0 && (
							<Box sx={{ width: "100%", height: 260 }}>
								<ResponsiveContainer width="100%" height="100%">
									<LineChart data={trendChartData}>
										<XAxis dataKey="date" tick={{ fontSize: 12 }} />
										<YAxis tick={{ fontSize: 12 }} />
										<Tooltip formatter={(value: number) => [`${value.toFixed(2)} kg`, "Waste"]} />
										<Line
											type="monotone"
											dataKey="totalWeight"
											stroke={theme.palette.primary.main}
											strokeWidth={3}
											dot={false}
										/>
									</LineChart>
								</ResponsiveContainer>
							</Box>
						)}
					</Paper>
				</Grid>

				<Grid item xs={12} md={5}>
					<Paper elevation={2} sx={{ padding: 3, height: "100%" }}>
						<Typography variant="h6" mb={2}>
							Waste Distribution
						</Typography>
						{isSummaryLoading && <Skeleton variant="rectangular" height={260} />}
						{isSummaryError && (
							<Typography variant="body2" color="error">
								Unable to load distribution breakdown.
							</Typography>
						)}
						{!isSummaryLoading && !isSummaryError && pieChartData.length === 0 && (
							<Typography variant="body2" color="text.secondary">
								No distribution data available yet.
							</Typography>
						)}
						{!isSummaryLoading && !isSummaryError && pieChartData.length > 0 && (
							<CustomPieChart
								data={pieChartData}
								height={260}
								width="100%"
								innerRadius={70}
								outerRadius={110}
								centerLabel="kg"
							/>
						)}
					</Paper>
				</Grid>
			</Grid>

			<Paper elevation={2} sx={{ padding: 3 }}>
				<Typography variant="h6" mb={2}>
					Collection History
				</Typography>
				{isHistoryLoading && <Skeleton variant="rectangular" height={220} />}
				{isHistoryError && (
					<Typography variant="body2" color="error">
						Unable to load collection history.
					</Typography>
				)}
				{!isHistoryLoading && !isHistoryError && historyPreview.length === 0 && (
					<Typography variant="body2" color="text.secondary">
						No collection records available.
					</Typography>
				)}
				{!isHistoryLoading && !isHistoryError && historyPreview.length > 0 && (
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Date</TableCell>
									<TableCell>Time</TableCell>
									<TableCell>Waste Type</TableCell>
									<TableCell align="right">Amount (kg)</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{historyPreview.map((entry) => {
									const createdAt = entry.createdAt as string;
									const status = entry.status ?? "--";

									return (
										<TableRow key={entry._id}>
											<TableCell>{formatDate(createdAt)}</TableCell>
											<TableCell>{formatTime(createdAt)}</TableCell>
											<TableCell>{entry.garbageCategory}</TableCell>
											<TableCell align="right">
												{(entry.wasteWeight ?? 0).toFixed(2)}
											</TableCell>
											<TableCell>
												<Chip
													size="small"
													label={status}
													color={
														status.toLowerCase() === "collected"
															? "success"
															: status.toLowerCase() === "requested"
															? "info"
															: "warning"
													}
												/>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</Paper>

			<Paper elevation={2} sx={{ padding: 3 }}>
				<Typography variant="h6">Bin Utilization</Typography>
				{isLevelLoading && <Skeleton variant="rectangular" height={160} sx={{ mt: 2 }} />}
				{isLevelError && (
					<Typography variant="body2" color="error" sx={{ mt: 2 }}>
						Unable to load bin utilization data.
					</Typography>
				)}
				{!isLevelLoading && !isLevelError && (levelData?.bins?.length ?? 0) === 0 && (
					<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
						No bin utilization records available yet.
					</Typography>
				)}
				{!isLevelLoading && !isLevelError && (levelData?.bins?.length ?? 0) > 0 && (
					<Stack spacing={2} sx={{ mt: 2 }}>
						{levelData?.bins.map((bin) => {
							const binLabel = typeof bin.binId === "string" ? bin.binId : bin.binName ?? bin.binId?.binId ?? "Bin";
							return (
								<Box key={binLabel}>
									<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
										<Typography variant="body2" sx={{ fontWeight: 500 }}>
											{binLabel}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{bin.percentFilled.toFixed(0)}%
										</Typography>
									</Stack>
									<LinearProgress
										variant="determinate"
										value={Math.min(100, bin.percentFilled)}
										sx={{ height: 8, borderRadius: 9999 }}
									/>
									<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
										<Typography variant="caption" color="text.secondary">
											{(bin.totalWeight ?? 0).toFixed(2)} kg / {(bin.capacity ?? 0).toFixed(2)} kg
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{bin.deposits ?? 0} deposits
										</Typography>
									</Stack>
								</Box>
							);
						})}
					</Stack>
				)}
			</Paper>
		</Stack>
	);
};

export default WasteBinDashboard;
