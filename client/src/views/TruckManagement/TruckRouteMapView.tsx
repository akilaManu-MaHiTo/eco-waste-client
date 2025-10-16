import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  LocalShipping as TruckIcon,
  Delete as WasteIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  useLoadScript,
} from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const libraries: ('places' | 'geometry')[] = ['places', 'geometry'];

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const defaultCenter = {
  lat: 6.9271, // Default to Colombo, Sri Lanka
  lng: 79.8612,
};

interface RouteData {
  _id: string;
  garbage: Array<{
    _id: string;
    garbageId: {
      _id: string;
      wasteWeight: number;
      garbageCategory: string;
      status: string;
      binId: {
        _id: string;
        binId: string;
        location: string;
        currentWasteLevel: number;
        thresholdLevel: number;
        binType: string;
        availability: boolean;
        latitude: number;
        longitude: number;
      };
      createdBy: {
        _id: string;
        username: string;
        mobile: string;
        email: string;
      };
    };
    price: number;
    currency: string;
    status: string;
    dateAndTime: string;
  }>;
  truck: {
    _id: string;
    truckId: string;
    capacity: number;
    status: string;
    currentLocation: string;
    latitude: number;
    longitude: number;
  };
  deliveryStatus: string;
}

interface TruckRouteMapViewProps {
  routeData: RouteData;
}

const TruckRouteMapView: React.FC<TruckRouteMapViewProps> = ({ routeData }) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Debug logging
  useEffect(() => {
    console.log('Route Data:', routeData);
    console.log('Truck coordinates:', routeData?.truck?.latitude, routeData?.truck?.longitude);
    console.log('Collection points count:', collectionPoints.length);
    console.log('Collection points:', collectionPoints);
  }, [routeData]);

  const mapCenter = useMemo(() => {
    if (routeData?.truck?.latitude && routeData?.truck?.longitude) {
      return {
        lat: routeData.truck.latitude,
        lng: routeData.truck.longitude,
      };
    }
    return defaultCenter;
  }, [routeData]);

  const collectionPoints = useMemo(() => {
    const points = routeData?.garbage
      ?.map((item) => {
        const lat = item.garbageId.binId.latitude;
        const lng = item.garbageId.binId.longitude;
        
        // Validate coordinates
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
          console.warn('Invalid coordinates for bin:', item.garbageId.binId.binId, lat, lng);
          return null;
        }
        
        return {
          id: item._id,
          position: {
            lat: Number(lat),
            lng: Number(lng),
          },
          binId: item.garbageId.binId.binId,
          location: item.garbageId.binId.location,
          wasteWeight: item.garbageId.wasteWeight,
          category: item.garbageId.garbageCategory,
          owner: item.garbageId.createdBy.username,
          status: item.status,
          price: `${item.currency} ${item.price}`,
        };
      })
      .filter(Boolean) || [];

    console.log('Processed collection points:', points);
    return points;
  }, [routeData]);

  const calculateRoute = async () => {
    if (!window.google || !routeData?.truck || !collectionPoints.length) {
      console.log('Cannot calculate route - missing data');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const origin = { lat: routeData.truck.latitude, lng: routeData.truck.longitude };
    
    // Use all collection points as waypoints
    const waypoints = collectionPoints.map(point => ({
      location: point.position,
      stopover: true,
    }));

    console.log('Calculating route with:', {
      origin,
      waypoints: waypoints.length,
      destination: collectionPoints[collectionPoints.length - 1]?.position
    });

    try {
      const result = await directionsService.route({
        origin,
        destination: collectionPoints[collectionPoints.length - 1].position,
        waypoints: waypoints.slice(0, -1), // Remove last point as it's the destination
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      });

      console.log('Route calculated successfully:', result);
      setDirections(result);
      setShowDirections(true);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };

  const openInGoogleMaps = () => {
    if (!routeData?.truck || !collectionPoints.length) return;

    const origin = `${routeData.truck.latitude},${routeData.truck.longitude}`;
    const waypoints = collectionPoints.map(point => 
      `${point.position.lat},${point.position.lng}`
    ).join('|');
    
    const url = `https://www.google.com/maps/dir/${origin}/${waypoints}`;
    window.open(url, '_blank');
  };

  // Fit map bounds to show all markers
  useEffect(() => {
    if (map && (routeData?.truck || collectionPoints.length > 0)) {
      const bounds = new window.google.maps.LatLngBounds();
      
      // Add truck to bounds
      if (routeData?.truck?.latitude && routeData?.truck?.longitude) {
        bounds.extend({
          lat: routeData.truck.latitude,
          lng: routeData.truck.longitude,
        });
      }
      
      // Add collection points to bounds
      collectionPoints.forEach(point => {
        bounds.extend(point.position);
      });
      
      map.fitBounds(bounds);
      
      // Add some padding and set a minimum zoom level
      const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
        if (map.getZoom() && map.getZoom() > 15) {
          map.setZoom(15);
        }
      });
      
      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    }
  }, [map, routeData, collectionPoints]);

  const onMapLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  if (loadError) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">
          Map cannot be loaded. Please check your internet connection.
        </Typography>
      </Paper>
    );
  }

  if (!isLoaded) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography>Loading map...</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Route Map
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={calculateRoute}
              disabled={!collectionPoints.length}
            >
              Show Route
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={openInGoogleMaps}
              startIcon={<MapIcon />}
              disabled={!collectionPoints.length}
            >
              Open in Maps
            </Button>
          </Stack>
        </Box>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={mapCenter}
          onLoad={onMapLoad}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {/* Truck Marker */}
          {routeData?.truck?.latitude && routeData?.truck?.longitude && (
            <Marker
              position={{
                lat: routeData.truck.latitude,
                lng: routeData.truck.longitude,
              }}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5-1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5-1.5z" fill="#2196F3"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32),
                anchor: new window.google.maps.Point(16, 16),
              }}
              title={`Truck ${routeData.truck.truckId}`}
              onClick={() => setSelectedMarker('truck')}
            />
          )}

          {/* Collection Point Markers */}
          {collectionPoints.map((point, index) => (
            <Marker
              key={point.id}
              position={point.position}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF5722"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 24),
              }}
              label={{
                text: `${index + 1}`,
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
              title={`Collection Point ${index + 1}: ${point.binId}`}
              onClick={() => setSelectedMarker(point.id)}
            />
          ))}

          {/* Directions */}
          {showDirections && directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false, // Changed to false to show direction markers
                polylineOptions: {
                  strokeColor: '#2196F3',
                  strokeWeight: 4,
                  strokeOpacity: 0.8,
                },
                preserveViewport: true, // Prevent auto-zooming when directions are shown
              }}
            />
          )}

          {/* Info Windows */}
          {selectedMarker === 'truck' && routeData?.truck && (
            <InfoWindow
              position={{
                lat: routeData.truck.latitude,
                lng: routeData.truck.longitude,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <Box sx={{ p: 1, minWidth: 200 }}>
                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TruckIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      {routeData.truck.truckId}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    <strong>Status:</strong> {routeData.truck.status}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Capacity:</strong> {routeData.truck.capacity} Kg
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {routeData.truck.currentLocation}
                  </Typography>
                </Stack>
              </Box>
            </InfoWindow>
          )}

          {collectionPoints.map((point) => (
            selectedMarker === point.id && (
              <InfoWindow
                key={`info-${point.id}`}
                position={point.position}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <Box sx={{ p: 1, minWidth: 200 }}>
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <WasteIcon color="error" fontSize="small" />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {point.binId}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      <strong>Location:</strong> {point.location}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Weight:</strong> {point.wasteWeight} Kg
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong> {point.category}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Owner:</strong> {point.owner}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Price:</strong> {point.price}
                    </Typography>
                    <Chip 
                      label={point.status} 
                      size="small" 
                      color={point.status === 'Approved' ? 'success' : 'default'}
                    />
                  </Stack>
                </Box>
              </InfoWindow>
            )
          ))}
        </GoogleMap>

        {/* Route Summary */}
        <Box>
          <Typography variant="caption" color="text.secondary">
            <Box component="span" display="flex" alignItems="center" gap={0.5}>
              <TruckIcon fontSize="small" color="primary" />
              Truck Location (A) {routeData?.truck && `- ${routeData.truck.truckId}`}
            </Box>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
            <Box component="span" display="flex" alignItems="center" gap={0.5}>
              <LocationOnIcon fontSize="small" color="error" />
              Collection Points ({collectionPoints.length})
            </Box>
          </Typography>
          
          {collectionPoints.length > 0 && (
            <Box mt={1}>
              <Typography variant="caption" fontWeight="bold">
                Collection Points:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
                {collectionPoints.map((point, index) => (
                  <Chip 
                    key={point.id}
                    label={`${index + 1}. ${point.binId}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default TruckRouteMapView;