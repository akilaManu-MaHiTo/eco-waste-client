import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  MyLocation as MyLocationIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { enqueueSnackbar } from 'notistack';

interface LocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange: (latitude: number, longitude: number, address?: string) => void;
  disabled?: boolean;
  label?: string;
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  disabled = false,
  label = "Location",
}: LocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [manualLat, setManualLat] = useState<string>(latitude?.toString() || '');
  const [manualLng, setManualLng] = useState<string>(longitude?.toString() || '');

  useEffect(() => {
    if (latitude && longitude) {
      setCurrentLocation({ lat: latitude, lng: longitude });
      setManualLat(latitude.toString());
      setManualLng(longitude.toString());
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
          // Try to get address from coordinates using reverse geocoding
          const address = await reverseGeocode(latitude, longitude);
          
          setCurrentLocation({ lat: latitude, lng: longitude, address });
          setManualLat(latitude.toString());
          setManualLng(longitude.toString());
          onLocationChange(latitude, longitude, address);
          
          enqueueSnackbar('Current location detected successfully!', {
            variant: 'success',
          });
        } catch (error) {
          setCurrentLocation({ lat: latitude, lng: longitude });
          setManualLat(latitude.toString());
          setManualLng(longitude.toString());
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
    
    setCurrentLocation({ lat, lng });
    onLocationChange(lat, lng);
    
    enqueueSnackbar('Location updated successfully!', {
      variant: 'success',
    });
  };

  const openInMaps = () => {
    if (currentLocation) {
      const { lat, lng } = currentLocation;
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, '_blank');
    }
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
                View on Map
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}