import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DailyCollection from './DailyCollection';
import * as garbageRequestApi from '../../api/garbageRequestApi';
import * as truckApi from '../../api/truck';

// Mock the API modules
vi.mock('../../api/garbageRequestApi');
vi.mock('../../api/truck');
vi.mock('../../api/delivery');

// Mock the Google Maps hook
vi.mock('@react-google-maps/api', () => ({
  useLoadScript: () => ({
    isLoaded: true,
    loadError: null,
  }),
  GoogleMap: ({ children }: any) => <div data-testid="google-map">{children}</div>,
  Marker: ({ position }: any) => (
    <div data-testid="map-marker" data-position={JSON.stringify(position)} />
  ),
  InfoWindow: ({ children }: any) => <div data-testid="info-window">{children}</div>,
  DirectionsRenderer: () => <div data-testid="directions-renderer" />,
}));

// Mock components
vi.mock('./components', () => ({
  ActiveJobCard: ({ activeJob, onViewDetails, onCompleteBin, onCompleteDelivery }: any) => (
    <div data-testid="active-job-card">
      <div>Active Job: {activeJob?.truck.truckId}</div>
      <button onClick={onViewDetails}>View Details</button>
      <button onClick={() => onCompleteBin(activeJob?.garbage[0]?.garbageId._id)}>
        Complete Bin
      </button>
      <button onClick={onCompleteDelivery}>Complete Delivery</button>
    </div>
  ),
  JobCard: ({ truckId, onAction, actionLabel }: any) => (
    <div data-testid="job-card">
      <div>Truck: {truckId}</div>
      <button onClick={onAction}>{actionLabel}</button>
    </div>
  ),
  JobConfirmationDialog: ({ open, onConfirm, onClose }: any) =>
    open ? (
      <div data-testid="job-confirmation-dialog">
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
  RouteMapDialog: ({ open, onClose, onCompleteBin, onCompleteDelivery }: any) =>
    open ? (
      <div data-testid="route-map-dialog">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onCompleteBin('bin-123')}>Complete Bin in Dialog</button>
        <button onClick={onCompleteDelivery}>Complete Delivery in Dialog</button>
      </div>
    ) : null,
}));

// Mock other components
vi.mock('../../components/PageTitle', () => ({
  default: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('../../components/BreadCrumb', () => ({
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

// Sample test data
const mockPendingDelivery = {
  _id: 'delivery-123',
  deliveryStatus: 'Pending',
  truck: {
    _id: 'truck-001',
    truckId: 'TRK-001',
    capacity: 5000,
    currentLocation: 'Location A',
    latitude: 6.9271,
    longitude: 79.8612,
  },
  garbage: [
    {
      garbageId: {
        _id: 'garbage-001',
        wasteWeight: 100,
        binId: {
          _id: 'bin-001',
          latitude: 6.9280,
          longitude: 79.8620,
        },
      },
    },
    {
      garbageId: {
        _id: 'garbage-002',
        wasteWeight: 150,
        binId: {
          _id: 'bin-002',
          latitude: 6.9290,
          longitude: 79.8630,
        },
      },
    },
  ],
};

const mockInProgressDelivery = {
  ...mockPendingDelivery,
  _id: 'delivery-456',
  deliveryStatus: 'InProgress',
  truck: {
    ...mockPendingDelivery.truck,
    _id: 'truck-002',
    truckId: 'TRK-002',
  },
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const theme = createTheme();

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('DailyCollection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test 1: Verify that the component renders available jobs correctly
   * and allows users to accept a job
   */
  it('should render available jobs and allow accepting a job', async () => {
    // Mock API responses
    vi.mocked(garbageRequestApi.fetchAllPendingRequests).mockResolvedValue([
      mockPendingDelivery,
    ]);
    vi.mocked(garbageRequestApi.fetchAllInProgressRequests).mockResolvedValue([]);
    vi.mocked(truckApi.updateTruckInService).mockResolvedValue({} as any);

    const user = userEvent.setup();

    // Render component
    render(<DailyCollection />, { wrapper: createWrapper() });

    // Verify page title and breadcrumb
    expect(screen.getByText('Daily Collection')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();

    // Wait for available jobs to load
    await waitFor(() => {
      expect(screen.getByText('Available Collection Jobs')).toBeInTheDocument();
    });

    // Verify job card is displayed
    const jobCards = await screen.findAllByTestId('job-card');
    expect(jobCards.length).toBeGreaterThan(0);

    // Verify truck information is displayed
    expect(screen.getByText(/TRK-001/)).toBeInTheDocument();

    // Click "Accept Job" button
    const acceptButton = screen.getByRole('button', { name: /Accept Job/i });
    await user.click(acceptButton);

    // Verify confirmation dialog appears
    await waitFor(() => {
      expect(screen.getByTestId('job-confirmation-dialog')).toBeInTheDocument();
    });

    // Confirm job acceptance
    const confirmButton = screen.getByRole('button', { name: /Confirm/i });
    await user.click(confirmButton);

    // Verify API was called
    await waitFor(() => {
      expect(truckApi.updateTruckInService).toHaveBeenCalledWith(
        'truck-001',
        'delivery-123'
      );
    });
  });

  /**
   * Test 2: Verify that active jobs are displayed and users can complete
   * bin collections and deliveries
   */
  it('should display active jobs and allow completing bin collections and delivery', async () => {
    // Mock API responses
    vi.mocked(garbageRequestApi.fetchAllPendingRequests).mockResolvedValue([]);
    vi.mocked(garbageRequestApi.fetchAllInProgressRequests).mockResolvedValue([
      mockInProgressDelivery,
    ]);
    vi.mocked(truckApi.updateTruckWasteLoad).mockResolvedValue({} as any);
    vi.mocked(truckApi.updateTruckAvailable).mockResolvedValue({} as any);

    const user = userEvent.setup();

    // Render component
    render(<DailyCollection />, { wrapper: createWrapper() });

    // Wait for active job to load
    await waitFor(() => {
      expect(screen.getByTestId('active-job-card')).toBeInTheDocument();
    });

    // Verify active job information is displayed
    expect(screen.getByText(/Active Job: TRK-002/)).toBeInTheDocument();

    // Click "Complete Bin" button from the active job card
    const activeJobCard = screen.getByTestId('active-job-card');
    const completeBinButton = within(activeJobCard).getByRole('button', { name: /Complete Bin/i });
    await user.click(completeBinButton);

    // Verify bin completion API was called
    await waitFor(() => {
      expect(truckApi.updateTruckWasteLoad).toHaveBeenCalledWith(
        'truck-002',
        'garbage-001'
      );
    });

    // Click "View Details" to open route map dialog from the active job card
    const viewDetailsButton = within(activeJobCard).getByRole('button', { name: /View Details/i });
    await user.click(viewDetailsButton);

    // Verify route map dialog opens
    await waitFor(() => {
      expect(screen.getByTestId('route-map-dialog')).toBeInTheDocument();
    });

    // Complete another bin from the dialog
    const completeBinDialogButton = screen.getByRole('button', {
      name: /Complete Bin in Dialog/i,
    });
    await user.click(completeBinDialogButton);

    // Verify bin completion was called again
    await waitFor(() => {
      expect(truckApi.updateTruckWasteLoad).toHaveBeenCalledWith('truck-002', 'bin-123');
    });

    // Complete the delivery
    const completeDeliveryButton = screen.getByRole('button', {
      name: /Complete Delivery in Dialog/i,
    });
    await user.click(completeDeliveryButton);

    // Verify delivery completion API was called
    await waitFor(() => {
      expect(truckApi.updateTruckAvailable).toHaveBeenCalledWith(
        'truck-002',
        'delivery-456'
      );
    });
  });
});
