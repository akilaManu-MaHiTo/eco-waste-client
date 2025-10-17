import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip,
  LinearProgress,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useQuery } from "@tanstack/react-query";
import { fetchTrucks, Truck } from "../../api/truck";
import { fetchAllRoutes } from "../../api/garbageRequestApi";
import { 
  LocalShipping as TruckIcon,
  CheckCircle as CheckIcon,
  Schedule as PendingIcon,
  Loop as InProgressIcon,
  Assessment as AssessmentIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  DeleteOutline as WasteIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface RouteData {
  _id: string;
  truck: {
    _id: string;
    truckId: string;
  };
  deliveryStatus: string;
  garbage: any[];
}

function CollectorDashboard() {
  const breadcrumbItems = [
    { title: "Waste Collection", href: "/home" },
    { title: `Collection Dashboard` },
  ];

  // Fetch trucks data
  const { data: trucks, isLoading: trucksLoading } = useQuery({
    queryKey: ["trucks"],
    queryFn: fetchTrucks,
  });

  // Fetch routes data
  const { data: routes, isLoading: routesLoading } = useQuery<RouteData[]>({
    queryKey: ["all-routes"],
    queryFn: fetchAllRoutes,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!trucks || !routes) return null;

    const totalTrucks = trucks.length;
    const availableTrucks = trucks.filter((t: Truck) => t.status === "Available").length;
    const inServiceTrucks = trucks.filter((t: Truck) => t.status === "In Service").length;
    const maintenanceTrucks = trucks.filter((t: Truck) => t.status === "Under Maintenance").length;
    const pendingRoutes = routes.filter(r => r.deliveryStatus === "pending").length;
    const inProgressRoutes = routes.filter(r => r.deliveryStatus === "in-progress").length;
    const completedRoutes = routes.filter(r => r.deliveryStatus === "completed").length;
    const totalWasteLoad = trucks.reduce((sum: number, t: Truck) => 
      sum + (t.currentWasteLoad || 0), 0
    );

    const totalCapacity = trucks.reduce((sum: number, t: Truck) => 
      sum + (t.capacity || 0), 0
    );

    // Calculate average collection points per route
    const avgCollectionPoints = routes.length > 0 
      ? routes.reduce((sum, r) => sum + r.garbage.length, 0) / routes.length 
      : 0;

    // Calculate total collection points
    const totalCollectionPoints = routes.reduce((sum, r) => sum + r.garbage.length, 0);

    // Efficiency metric (completed routes / total routes)
    const efficiencyRate = routes.length > 0 ? (completedRoutes / routes.length) * 100 : 0;

    return {
      totalTrucks,
      availableTrucks,
      inServiceTrucks,
      maintenanceTrucks,
      pendingRoutes,
      inProgressRoutes,
      completedRoutes,
      totalRoutes: routes.length,
      totalWasteLoad,
      totalCapacity,
      capacityPercentage: totalCapacity > 0 ? (totalWasteLoad / totalCapacity) * 100 : 0,
      avgCollectionPoints,
      totalCollectionPoints,
      efficiencyRate,
    };
  }, [trucks, routes]);

  // Prepare chart data
  const truckStatusChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Available", value: stats.availableTrucks, color: "#4caf50" },
      { name: "In Service", value: stats.inServiceTrucks, color: "#ff9800" },
      { name: "Maintenance", value: stats.maintenanceTrucks, color: "#f44336" },
    ].filter(item => item.value > 0);
  }, [stats]);

  const routeStatusChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Pending", value: stats.pendingRoutes, color: "#2196f3" },
      { name: "In Progress", value: stats.inProgressRoutes, color: "#ff9800" },
      { name: "Completed", value: stats.completedRoutes, color: "#4caf50" },
    ].filter(item => item.value > 0);
  }, [stats]);

  const capacityChartData = useMemo(() => {
    if (!trucks) return [];
    return trucks.map((truck: Truck) => ({
      name: truck.truckId,
      current: truck.currentWasteLoad || 0,
      capacity: truck.capacity,
      percentage: ((truck.currentWasteLoad || 0) / truck.capacity) * 100,
    }));
  }, [trucks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "success";
      case "In Service":
        return "warning";
      case "Under Maintenance":
        return "error";
      default:
        return "default";
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4caf50";
      case "in-progress":
        return "#ff9800";
      case "pending":
        return "#2196f3";
      default:
        return "#757575";
    }
  };

  const isLoading = trucksLoading || routesLoading;

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

      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3, py: 4 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={60} />
              <Typography color="text.secondary">Loading dashboard data...</Typography>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Statistics Cards */}
            {stats && (
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                {/* Total Trucks */}
                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="body2" color="text.secondary">
                            Total Trucks
                          </Typography>
                          <Typography variant="h3" fontWeight="bold" color="primary">
                            {stats.totalTrucks}
                          </Typography>
                        </Stack>
                        <Avatar sx={{ bgcolor: "#e3f2fd", width: 60, height: 60 }}>
                          <TruckIcon sx={{ fontSize: 32, color: "#1976d2" }} />
                        </Avatar>
                      </Stack>
                      <Divider />
                      <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Available
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {stats.availableTrucks}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            In Service
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="warning.main">
                            {stats.inServiceTrucks}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Maintenance
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="error.main">
                            {stats.maintenanceTrucks}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Routes Overview */}
                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="body2" color="text.secondary">
                            Total Routes
                          </Typography>
                          <Typography variant="h3" fontWeight="bold" color="secondary">
                            {stats.totalRoutes}
                          </Typography>
                        </Stack>
                        <Avatar sx={{ bgcolor: "#fce4ec", width: 60, height: 60 }}>
                          <AssessmentIcon sx={{ fontSize: 32, color: "#c2185b" }} />
                        </Avatar>
                      </Stack>
                      <Divider />
                      <Stack spacing={0.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PendingIcon sx={{ fontSize: 16, color: "#2196f3" }} />
                            <Typography variant="body2" color="text.secondary">
                              Pending
                            </Typography>
                          </Stack>
                          <Typography variant="body2" fontWeight="bold" color="#2196f3">
                            {stats.pendingRoutes}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <InProgressIcon sx={{ fontSize: 16, color: "#ff9800" }} />
                            <Typography variant="body2" color="text.secondary">
                              In Progress
                            </Typography>
                          </Stack>
                          <Typography variant="body2" fontWeight="bold" color="#ff9800">
                            {stats.inProgressRoutes}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CheckIcon sx={{ fontSize: 16, color: "#4caf50" }} />
                            <Typography variant="body2" color="text.secondary">
                              Completed
                            </Typography>
                          </Stack>
                          <Typography variant="body2" fontWeight="bold" color="#4caf50">
                            {stats.completedRoutes}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Waste Capacity */}
                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="body2" color="text.secondary">
                            Fleet Capacity
                          </Typography>
                          <Typography variant="h3" fontWeight="bold" color="success.main">
                            {stats.capacityPercentage.toFixed(0)}%
                          </Typography>
                        </Stack>
                        <Avatar sx={{ bgcolor: "#e8f5e9", width: 60, height: 60 }}>
                          <AssessmentIcon sx={{ fontSize: 32, color: "#4caf50" }} />
                        </Avatar>
                      </Stack>
                      <Divider />
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Current Load
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {stats.totalWasteLoad} kg
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(stats.capacityPercentage, 100)} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: stats.capacityPercentage > 80 ? "#f44336" : 
                                       stats.capacityPercentage > 50 ? "#ff9800" : "#4caf50",
                            }
                          }}
                        />
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Total Capacity
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {stats.totalCapacity} kg
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            )}

            {/* Charts Section */}
            {stats && (
              <Stack direction={{ xs: "column", lg: "row" }} spacing={3}>
                {/* Truck Status Distribution */}
                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Truck Status Distribution
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Fleet availability overview
                    </Typography>
                    {truckStatusChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={truckStatusChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {truckStatusChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography color="text.secondary">No truck data available</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Route Status Distribution */}
                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Route Status Distribution
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Collection progress tracking
                    </Typography>
                    {routeStatusChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={routeStatusChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {routeStatusChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography color="text.secondary">No route data available</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            )}

            {/* Additional Statistics Cards */}
            {stats && (
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                          <TrendingUpIcon sx={{ fontSize: 24, color: "white" }} />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" color="white">
                          {stats.efficiencyRate.toFixed(1)}%
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        Completion Rate
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        Overall route efficiency
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0", background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                          <WasteIcon sx={{ fontSize: 24, color: "white" }} />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" color="white">
                          {stats.totalCollectionPoints}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        Collection Points
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        Total bins to collect
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1, borderRadius: 3, border: "1px solid #e0e0e0", background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                          <SpeedIcon sx={{ fontSize: 24, color: "white" }} />
                        </Avatar>
                        <Typography variant="h4" fontWeight="bold" color="white">
                          {stats.avgCollectionPoints.toFixed(1)}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="white" fontWeight="bold">
                        Avg. Points/Route
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        Collection efficiency
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            )}

            {/* Truck Capacity Chart */}
            {capacityChartData.length > 0 && (
              <Card sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Truck Capacity Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Current load vs maximum capacity for each truck
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={capacityChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" fill="#4caf50" name="Current Load" />
                      <Bar dataKey="capacity" fill="#e0e0e0" name="Max Capacity" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Truck Fleet Status */}
            <Card sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ bgcolor: "#f8f9fa", p: 3, borderBottom: "1px solid #e0e0e0" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Fleet Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time overview of all trucks
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {trucks && trucks.length > 0 ? (
                      trucks.map((truck: Truck) => (
                        <Card 
                          key={truck._id} 
                          sx={{ 
                            borderRadius: 2, 
                            border: "1px solid #e0e0e0",
                            transition: "all 0.2s",
                            "&:hover": { 
                              boxShadow: 3,
                              borderColor: "#1976d2",
                            }
                          }}
                        >
                          <CardContent>
                            <Stack spacing={2}>
                              <Stack 
                                direction={{ xs: "column", sm: "row" }} 
                                justifyContent="space-between" 
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                spacing={2}
                              >
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Avatar sx={{ bgcolor: "#e3f2fd", width: 48, height: 48 }}>
                                    <TruckIcon sx={{ fontSize: 24, color: "#1976d2" }} />
                                  </Avatar>
                                  <Stack>
                                    <Typography variant="h6" fontWeight="bold">
                                      {truck.truckId}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <PersonIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {truck.driver?.username || "No Driver Assigned"}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </Stack>
                                <Chip 
                                  label={truck.status} 
                                  color={getStatusColor(truck.status) as any}
                                  sx={{ fontWeight: "bold" }}
                                />
                              </Stack>

                              <Divider />

                              <Stack 
                                direction={{ xs: "column", md: "row" }} 
                                spacing={3}
                              >
                                <Stack flex={1} spacing={1}>
                                  <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                    Capacity
                                  </Typography>
                                  <Stack direction="row" spacing={1} alignItems="baseline">
                                    <Typography variant="h6" fontWeight="bold">
                                      {truck.currentWasteLoad || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      / {truck.capacity} kg
                                    </Typography>
                                  </Stack>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={((truck.currentWasteLoad || 0) / truck.capacity) * 100}
                                    sx={{ 
                                      height: 6, 
                                      borderRadius: 3,
                                      bgcolor: "#e0e0e0",
                                      "& .MuiLinearProgress-bar": {
                                        bgcolor: ((truck.currentWasteLoad || 0) / truck.capacity) > 0.8 ? "#f44336" : 
                                                 ((truck.currentWasteLoad || 0) / truck.capacity) > 0.5 ? "#ff9800" : "#4caf50",
                                      }
                                    }}
                                  />
                                </Stack>

                                <Stack flex={2} spacing={0.5}>
                                  <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <LocationIcon sx={{ fontSize: 16, color: "text.secondary", mt: 0.5 }} />
                                    <Stack flex={1}>
                                      <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                        Current Location
                                      </Typography>
                                      <Typography variant="body2">
                                        {truck.currentLocation || "Location not available"}
                                      </Typography>
                                      {truck.latitude && truck.longitude && (
                                        <Typography variant="caption" color="text.secondary">
                                          {truck.latitude.toFixed(6)}, {truck.longitude.toFixed(6)}
                                        </Typography>
                                      )}
                                    </Stack>
                                  </Stack>
                                </Stack>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Box sx={{ textAlign: "center", py: 6 }}>
                        <TruckIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Trucks Available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Add trucks to your fleet to get started
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Routes Overview */}
            <Card sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ bgcolor: "#f8f9fa", p: 3, borderBottom: "1px solid #e0e0e0" }}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Routes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Collection route activities
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    {routes && routes.length > 0 ? (
                      routes.slice(0, 10).map((route: RouteData) => (
                        <Card 
                          key={route._id} 
                          sx={{ 
                            borderRadius: 2, 
                            border: "1px solid #e0e0e0",
                            transition: "all 0.2s",
                            "&:hover": { 
                              boxShadow: 2,
                            }
                          }}
                        >
                          <CardContent>
                            <Stack 
                              direction={{ xs: "column", sm: "row" }} 
                              justifyContent="space-between" 
                              alignItems={{ xs: "flex-start", sm: "center" }}
                              spacing={2}
                            >
                              <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: getDeliveryStatusColor(route.deliveryStatus) + "20",
                                    width: 40, 
                                    height: 40 
                                  }}
                                >
                                  {route.deliveryStatus === "completed" && (
                                    <CheckIcon sx={{ color: getDeliveryStatusColor(route.deliveryStatus) }} />
                                  )}
                                  {route.deliveryStatus === "in-progress" && (
                                    <InProgressIcon sx={{ color: getDeliveryStatusColor(route.deliveryStatus) }} />
                                  )}
                                  {route.deliveryStatus === "pending" && (
                                    <PendingIcon sx={{ color: getDeliveryStatusColor(route.deliveryStatus) }} />
                                  )}
                                </Avatar>
                                <Stack flex={1}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    Route #{route._id.slice(-8).toUpperCase()}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Truck: {route.truck.truckId} • {route.garbage.length} collection points
                                  </Typography>
                                </Stack>
                              </Stack>
                              <Chip 
                                label={route.deliveryStatus.replace("-", " ").toUpperCase()}
                                sx={{ 
                                  bgcolor: getDeliveryStatusColor(route.deliveryStatus) + "20",
                                  color: getDeliveryStatusColor(route.deliveryStatus),
                                  fontWeight: "bold",
                                  textTransform: "capitalize",
                                }}
                              />
                            </Stack>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Box sx={{ textAlign: "center", py: 6 }}>
                        <AssessmentIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Routes Found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Collection routes will appear here
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default CollectorDashboard;
