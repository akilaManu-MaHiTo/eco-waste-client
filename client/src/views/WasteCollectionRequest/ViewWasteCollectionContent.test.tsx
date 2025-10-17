import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ViewGarbageContent from './ViewWasteCollectionContent';
import createWrapper from '../../test/test-utils';

// Mock useIsMobile
vi.mock('../../customHooks/useIsMobile', () => ({ default: vi.fn(() => ({ isTablet: false })) }));

// Mock DrawerContentItem to make it simple to assert
vi.mock('../../components/ViewDataDrawer', () => ({
  DrawerContentItem: ({ label, value }: any) => <div data-testid="drawer-item">{label}: {value}</div>,
}));

// Mock useCurrentUser
vi.mock('../../hooks/useCurrentUser', () => ({ default: vi.fn(() => ({ user: { _id: 'u1' } })) }));

// Mock Google Maps loader and components
vi.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }: any) => <div data-testid="google-map">{children}</div>,
  MarkerF: ({ position }: any) => <div data-testid="marker">{position.lat},{position.lng}</div>,
  useJsApiLoader: () => ({ isLoaded: true }),
}));

describe('ViewGarbageContent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders drawer content items and map when coordinates exist and isLoaded', async () => {
    const garbageCollection: any = {
      _id: 'gc1',
      garbageId: { binId: { binId: 'BIN-1', binType: 'Plastic', latitude: 6.9, longitude: 79.8 } },
      price: 250,
    };

    const wrapper = createWrapper();
    render(<ViewGarbageContent garbageCollection={garbageCollection} />, { wrapper });

    // Check drawer items
    expect(screen.getByText(/Reference Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Garbage Bin ID/i)).toBeInTheDocument();

    // Map and marker should be rendered
    await waitFor(() => expect(screen.getByTestId('google-map')).toBeInTheDocument());
    expect(screen.getByTestId('marker')).toHaveTextContent('6.9,79.8');
  });

  it('shows info alert when location data missing or not loaded', async () => {
    // Re-spy the module to return not loaded
    const mapsApi = require('@react-google-maps/api');
    vi.spyOn(mapsApi, 'useJsApiLoader').mockReturnValue({ isLoaded: false });

    const garbageCollection: any = { _id: 'gc2', garbageId: { binId: { binId: 'BIN-2' } }, price: 100 };
    const wrapper = createWrapper();
    render(<ViewGarbageContent garbageCollection={garbageCollection} />, { wrapper });

    await waitFor(() => expect(screen.getByText(/Location data not available/i)).toBeInTheDocument());
  });
});
