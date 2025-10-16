import { Box, Stack, Typography, Divider, Chip, Paper, Alert, Grid } from "@mui/material";
import { format } from "date-fns";
import useIsMobile from "../../customHooks/useIsMobile";
import { DrawerContentItem } from "../../components/ViewDataDrawer";
import { WasteBin } from "../../api/wasteBin";
import { Truck } from "../../api/truck";
import { useQuery } from "@tanstack/react-query";
import { fetchRouteByTruckId } from "../../api/garbageRequestApi";
import TruckRouteMapView from "./TruckRouteMapView";
import { 
  LocalShipping as TruckIcon, 
  LocationOn as LocationIcon,
  Delete as WasteIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MoneyIcon
} from "@mui/icons-material";

function ViewTruckContent({ truck }: { truck: Truck }) {

  const { data: routeData, isFetching: isrouteDataFetching } = useQuery({
    queryKey: ["route-data", truck?._id], 
    queryFn: () => fetchRouteByTruckId(truck?._id), 
    enabled: !!truck?._id, 
  });

  console.log("Route Data:", routeData);

  const { isTablet } = useIsMobile();

  // Calculate route summary
  const routeSummary = routeData ? {
    totalCollections: routeData.garbage?.length || 0,
    totalWeight: routeData.garbage?.reduce((sum: number, item: any) => sum + (item.garbageId?.wasteWeight || 0), 0) || 0,
    totalValue: routeData.garbage?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0,
    approvedCount: routeData.garbage?.filter((item: any) => item.status === 'Approved').length || 0,
  } : null;
  return (
    <Stack spacing={2}>
      {/* Quick Summary Alert */}
      {routeData && (
        <Alert 
          severity="info" 
          icon={<TruckIcon />}
          sx={{ backgroundColor: '#e3f2fd', border: '1px solid #2196f3' }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Route Summary: {routeSummary?.totalCollections} collection points • {routeSummary?.totalWeight} Kg total waste • LKR {routeSummary?.totalValue} total value
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Status: {routeData.deliveryStatus} • {routeSummary?.approvedCount}/{routeSummary?.totalCollections} approved collections
          </Typography>
        </Alert>
      )}

      {/* Truck Basic Info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <DrawerContentItem
          label="Reference Number"
          value={truck?._id}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Truck ID"
          value={truck?.truckId}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Capacity (Kg)"
          value={truck?.capacity + "Kg"}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Status"
          value={truck?.status}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Current Location"
          value={truck?.currentLocation || "Location not available"}
          sx={{ flex: 1 }}
        />
        {truck?.latitude && truck?.longitude && (
          <DrawerContentItem
            label="GPS Coordinates"
            value={`${truck.latitude.toFixed(6)}, ${truck.longitude.toFixed(6)}`}
            sx={{ flex: 1 }}
          />
        )}
      </Box>

      {/* Route Information */}
      {routeData && (
        <>
          <Divider />
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <TruckIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Route Information
            </Typography>
          </Box>
          
          {/* Route Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {routeSummary?.totalCollections || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Collection Points
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {routeSummary?.totalWeight || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Weight (Kg)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  LKR {routeSummary?.totalValue || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Value
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                <Chip
                  label={routeData.deliveryStatus}
                  color={routeData.deliveryStatus === 'Completed' ? 'success' : 
                         routeData.deliveryStatus === 'In Progress' ? 'warning' : 'default'}
                  sx={{ fontWeight: 'bold' }}
                />
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                  Delivery Status
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Route Map */}
          <TruckRouteMapView routeData={routeData} />

          {/* Collection Points */}
          <Divider />
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <WasteIcon color="error" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Collection Points ({routeData.garbage?.length || 0})
            </Typography>
          </Box>
          
          <Stack spacing={2}>
            {routeData.garbage?.map((garbageItem: any, index: number) => (
              <Paper 
                key={garbageItem._id} 
                elevation={2} 
                sx={{ 
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: garbageItem.status === 'Approved' ? '#f8fff8' : '#fff8f8'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon fontSize="small" color="error" />
                    Collection Stop #{index + 1}
                  </Typography>
                  <Chip 
                    label={garbageItem.status}
                    size="small"
                    color={garbageItem.status === 'Approved' ? 'success' : 'warning'}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Stack spacing={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Bin ID:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {garbageItem.garbageId?.binId?.binId}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Location:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>
                      {garbageItem.garbageId?.binId?.location}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Weight:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {garbageItem.garbageId?.wasteWeight} Kg
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Category:</Typography>
                    <Chip 
                      label={garbageItem.garbageId?.garbageCategory}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Owner:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {garbageItem.garbageId?.createdBy?.username}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Price:</Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <MoneyIcon fontSize="small" color="success" />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {garbageItem.currency} {garbageItem.price}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {garbageItem.dateAndTime && (
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Scheduled:</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <ScheduleIcon fontSize="small" color="warning" />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {garbageItem.dateAndTime}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {/* Coordinates for debugging/admin use */}
                  <Divider sx={{ my: 1 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">Coordinates:</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {garbageItem.garbageId?.binId?.latitude?.toFixed(6)}, {garbageItem.garbageId?.binId?.longitude?.toFixed(6)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </>
      )}
      
      {isrouteDataFetching && (
        <Typography variant="body2" color="text.secondary">
          Loading route information...
        </Typography>
      )}
    </Stack>
  );
}

export default ViewTruckContent;
