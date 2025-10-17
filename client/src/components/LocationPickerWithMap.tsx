import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  MyLocation as MyLocationIcon,
  Map as MapIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { enqueueSnackbar } from 'notistack';

interface LocationPickerWithMapProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange: (latitude: number, longitude: number, address?: string) => void;
  disabled?: boolean;
  label?: string;
  googleMapsApiKey?: string; 
}

const libraries: ('places')[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function LocationPickerWithMap({
  latitude,
  longitude,
  onLocationChange,
  disabled = false,
  label = "Location",
  googleMapsApiKey,
}: LocationPickerWithMapProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [manualLat, setManualLat] = useState<string>(latitude?.toString() || '');
  const [manualLng, setManualLng] = useState<string>(longitude?.toString() || '');
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || '',
    libraries,
  });

  useEffect(() => {
    if (latitude && longitude) {
      const location = { lat: latitude, lng: longitude };
      setCurrentLocation(location);
      setManualLat(latitude.toString());
      setManualLng(longitude.toString());
      setMapCenter(location);
    }
  }, [latitude, longitude]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar('Geolocation is not supported by this browser.', {
        variant: 'error',
      });
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const address = await reverseGeocode(latitude, longitude);
          
          const location = { lat: latitude, lng: longitude, address };
          setCurrentLocation(location);
          setManualLat(latitude.toString());
          setManualLng(longitude.toString());
          setMapCenter({ lat: latitude, lng: longitude });
          onLocationChange(latitude, longitude, address);
          
          enqueueSnackbar('Current location detected successfully!', {
            variant: 'success',
          });
        } catch (error) {
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);
          setManualLat(latitude.toString());
          setManualLng(longitude.toString());
          setMapCenter({ lat: latitude, lng: longitude });
          onLocationChange(latitude, longitude);
          
          enqueueSnackbar('Location detected, but address could not be retrieved.', {
            variant: 'warning',
          });
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        let message = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        
        enqueueSnackbar(message, { variant: 'error' });
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Try Google Maps Geocoding API first if available
      if (googleMapsApiKey && window.google && window.google.maps) {
        const geocoder = new window.google.maps.Geocoder();
        const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
              if (status === 'OK' && results && results.length > 0) {
                resolve(results);
              } else {
                reject(new Error('Geocoding failed'));
              }
            }
          );
        });
        return result[0].formatted_address;
      }
    } catch (error) {
      console.warn('Google Maps geocoding failed, trying OpenStreetMap:', error);
    }

    // Fallback to OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding failed');
    }
    
    const data = await response.json();
    return data.display_name || 'Address not found';
  };

  const handleManualLocationUpdate = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      enqueueSnackbar('Please enter valid latitude and longitude values.', {
        variant: 'error',
      });
      return;
    }
    
    if (lat < -90 || lat > 90) {
      enqueueSnackbar('Latitude must be between -90 and 90.', {
        variant: 'error',
      });
      return;
    }
    
    if (lng < -180 || lng > 180) {
      enqueueSnackbar('Longitude must be between -180 and 180.', {
        variant: 'error',
      });
      return;
    }
    
    const location = { lat, lng };
    setCurrentLocation(location);
    setMapCenter(location);
    onLocationChange(lat, lng);
    
    enqueueSnackbar('Location updated successfully!', {
      variant: 'success',
    });
  };

  const handleMapClick = useCallback(async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      try {
        const address = await reverseGeocode(lat, lng);
        const location = { lat, lng, address };
        setCurrentLocation(location);
        setManualLat(lat.toString());
        setManualLng(lng.toString());
        onLocationChange(lat, lng, address);
        
        enqueueSnackbar('Location selected from map!', {
          variant: 'success',
        });
      } catch (error) {
        const location = { lat, lng };
        setCurrentLocation(location);
        setManualLat(lat.toString());
        setManualLng(lng.toString());
        onLocationChange(lat, lng);
        
        enqueueSnackbar('Location selected, but address could not be retrieved.', {
          variant: 'warning',
        });
      }
    }
  }, [onLocationChange]);

  const openInMaps = () => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const MapDialog = () => {
    if (loadError) {
      return (
        <Dialog open={isMapDialogOpen} onClose={() => setIsMapDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Select Location
            <IconButton
              onClick={() => setIsMapDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography color="error">
              Error loading Google Maps. Please use the manual coordinate input instead.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsMapDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      );
    }

    if (!isLoaded) {
      return (
        <Dialog open={isMapDialogOpen} onClose={() => setIsMapDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Loading Map...</DialogTitle>
          <DialogContent>
            <Typography>Loading Google Maps...</Typography>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog open={isMapDialogOpen} onClose={() => setIsMapDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Select Location on Map
          <IconButton
            onClick={() => setIsMapDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Click on the map to select a location
          </Typography>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={15}
            center={mapCenter}
            onClick={handleMapClick}
          >
            {currentLocation && (
              <Marker
                position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              />
            )}
          </GoogleMap>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsMapDialogOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Paper elevation={1} sx={{ p: 2, m: 0.5 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      
      <Stack spacing={2}>
        {/* Current Location Button */}
        <Button
          variant="outlined"
          startIcon={<MyLocationIcon />}
          onClick={getCurrentLocation}
          disabled={disabled || isLoadingLocation}
          fullWidth
        >
          {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
        </Button>

        {/* Map Selection Button (only if Google Maps is available) */}
        {googleMapsApiKey && (
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            onClick={() => setIsMapDialogOpen(true)}
            disabled={disabled}
            fullWidth
          >
            Select on Map
          </Button>
        )}

        {/* Manual Coordinate Input */}
        <Stack direction="row" spacing={1}>
          <TextField
            label="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            size="small"
            type="number"
            inputProps={{
              step: 'any',
              min: -90,
              max: 90,
            }}
            disabled={disabled}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Longitude"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            size="small"
            type="number"
            inputProps={{
              step: 'any',
              min: -180,
              max: 180,
            }}
            disabled={disabled}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Button
          variant="outlined"
          onClick={handleManualLocationUpdate}
          disabled={disabled || !manualLat || !manualLng}
          size="small"
        >
          Update Location
        </Button>

        {/* Current Location Display */}
        {currentLocation && (
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <LocationOnIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Current Location:
              </Typography>
            </Stack>
            
            <Stack spacing={1}>
              <Chip
                label={`${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`}
                size="small"
                variant="outlined"
              />
              
              {currentLocation.address && (
                <Typography variant="caption" color="text.secondary">
                  {currentLocation.address}
                </Typography>
              )}
              
              <Button
                variant="text"
                startIcon={<MapIcon />}
                onClick={openInMaps}
                size="small"
                sx={{ alignSelf: 'flex-start' }}
              >
                View on Google Maps
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>

      {/* Map Dialog */}
      {googleMapsApiKey && <MapDialog />}
    </Paper>
  );
}