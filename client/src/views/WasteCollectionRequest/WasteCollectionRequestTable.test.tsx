import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import WasteCollectionRequestTable from './WasteCollectionRequestTable';
import * as garbageRequestApi from '../../api/garbageRequestApi';

// Mock the API module
vi.mock('../../api/garbageRequestApi');

// Create mock functions using vi.hoisted to avoid hoisting issues
const { mockJsPDF, mockAutoTable } = vi.hoisted(() => ({
  mockJsPDF: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    text: vi.fn(),
    save: vi.fn(),
    lastAutoTable: { finalY: 100 },
  })),
  mockAutoTable: vi.fn(),
}));

// Mock jsPDF and autoTable
vi.mock('jspdf', () => ({
  default: mockJsPDF,
}));

vi.mock('jspdf-autotable', () => ({
  default: mockAutoTable,
}));

// Mock components
vi.mock('../../components/PageTitle', () => ({
  default: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('../../components/BreadCrumb', () => ({
  default: ({ breadcrumbs }: any) => (
    <div data-testid="breadcrumb">{breadcrumbs[breadcrumbs.length - 1].title}</div>
  ),
}));

vi.mock('../../components/ViewDataDrawer', () => ({
  default: ({ open, drawerContent }: any) =>
    open ? <div data-testid="view-drawer">{drawerContent}</div> : null,
  DrawerHeader: ({ title, handleClose }: any) => (
    <div data-testid="drawer-header">
      <span>{title}</span>
      <button onClick={handleClose}>Close</button>
    </div>
  ),
}));

vi.mock('./ViewWasteCollectionContent', () => ({
  default: ({ garbageCollection }: any) => (
    <div data-testid="view-content">Waste Details: {garbageCollection._id}</div>
  ),
}));

vi.mock('./CollectionRouteModal', () => ({
  default: ({ open, handleClose, selectedRowsData }: any) =>
    open ? (
      <div data-testid="collection-route-modal">
        <span>Selected: {selectedRowsData?.length || 0}</span>
        <button onClick={handleClose}>Close Modal</button>
      </div>
    ) : null,
}));

vi.mock('../../components/DeleteConfirmationModal', () => ({
  default: ({ open, handleClose }: any) =>
    open ? (
      <div data-testid="delete-modal">
        <button onClick={handleClose}>Cancel</button>
      </div>
    ) : null,
}));

// Sample test data
const mockPendingRequests = [
  {
    _id: 'request-001',
    dateAndTime: '2025-10-15 10:30 AM',
    status: 'Pending',
    garbageId: {
      _id: 'garbage-001',
      createdBy: {
        username: 'John Doe',
        mobile: '0771234567',
      },
      binId: {
        thresholdLevel: 75,
      },
    },
  },
  {
    _id: 'request-002',
    dateAndTime: '2025-10-16 02:15 PM',
    status: 'Pending',
    garbageId: {
      _id: 'garbage-002',
      createdBy: {
        username: 'Jane Smith',
        mobile: '0779876543',
      },
      binId: {
        thresholdLevel: 50,
      },
    },
  },
];

const mockApprovedRequests = [
  {
    _id: 'request-003',
    dateAndTime: '2025-10-14 09:00 AM',
    status: 'Approved',
    garbageId: {
      _id: 'garbage-003',
      createdBy: {
        username: 'Bob Wilson',
        mobile: '0775555555',
      },
      binId: {
        thresholdLevel: 90,
      },
    },
  },
];

const theme = createTheme();

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <WasteCollectionRequestTable {...props} />
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('WasteCollectionRequestTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Test 1: Renders pending waste collection requests correctly', () => {
    it('should display pending requests table with correct data', async () => {
      // Mock API response for pending requests
      vi.mocked(garbageRequestApi.fetchGarbageCollectionData).mockResolvedValue(
        mockPendingRequests
      );
      vi.mocked(garbageRequestApi.fetchGarbageCollectionDataApproved).mockResolvedValue([]);

      const user = userEvent.setup();
      renderComponent({ isPendingData: true });

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Waste Collection Requests')).toBeInTheDocument();
      });

      // Verify breadcrumb shows correct path
      expect(screen.getByTestId('breadcrumb')).toHaveTextContent(
        'Waste Collection Requests > Pending'
      );

      // Verify table headers are present
      expect(screen.getByText('Reference')).toBeInTheDocument();
      expect(screen.getByText('Date & Time')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
      expect(screen.getByText('Weight')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Select')).toBeInTheDocument();

      // Verify first request data is displayed
      await waitFor(() => {
        expect(screen.getByText('request-001')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('0771234567')).toBeInTheDocument();
        expect(screen.getByText('75 Kg')).toBeInTheDocument();
      });

      // Verify second request data is displayed
      expect(screen.getByText('request-002')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('0779876543')).toBeInTheDocument();
      expect(screen.getByText('50 Kg')).toBeInTheDocument();

      // Verify checkboxes are present for pending requests
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);

      // Test checkbox selection
      await user.click(checkboxes[0]);

      // Verify "Add Collection Route" button appears after selection
      await waitFor(() => {
        expect(screen.getByText('Add Collection Route')).toBeInTheDocument();
      });

      // Test opening collection route modal
      const addRouteButton = screen.getByText('Add Collection Route');
      await user.click(addRouteButton);

      await waitFor(() => {
        expect(screen.getByTestId('collection-route-modal')).toBeInTheDocument();
        expect(screen.getByText('Selected: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Test 2: Generates PDF report and handles approved requests', () => {
    it('should generate PDF report for approved requests and handle view drawer', async () => {
      // Mock API response for approved requests
      vi.mocked(garbageRequestApi.fetchGarbageCollectionData).mockResolvedValue([]);
      vi.mocked(garbageRequestApi.fetchGarbageCollectionDataApproved).mockResolvedValue(
        mockApprovedRequests
      );

      const user = userEvent.setup();
      renderComponent({ isApprovedData: true });

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Waste Collection Requests')).toBeInTheDocument();
      });

      // Verify breadcrumb shows approved path
      expect(screen.getByTestId('breadcrumb')).toHaveTextContent(
        'Waste Collection Requests > Approved'
      );

      // Wait for approved request data to be displayed
      await waitFor(() => {
        expect(screen.getByText('request-003')).toBeInTheDocument();
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      });

      // Verify "Generate Report" button is present and enabled after data loads
      await waitFor(() => {
        const generateReportButton = screen.getByText('Generate Report');
        expect(generateReportButton).toBeInTheDocument();
        expect(generateReportButton).not.toBeDisabled();
      });

      // Verify approved request data is displayed
      expect(screen.getByText('0775555555')).toBeInTheDocument();
      expect(screen.getByText('90 Kg')).toBeInTheDocument();

      // Verify "Select" column is NOT present for approved requests
      expect(screen.queryByText('Select')).not.toBeInTheDocument();

      // Test clicking on a row to open view drawer
      const rowToClick = screen.getByText('request-003');
      await user.click(rowToClick);

      await waitFor(() => {
        expect(screen.getByTestId('view-drawer')).toBeInTheDocument();
        expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
        expect(screen.getByText('Waste Details')).toBeInTheDocument();
        expect(screen.getByText('Waste Details: request-003')).toBeInTheDocument();
      });

      // Test closing the drawer
      const closeButton = screen.getByText('Close');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('view-drawer')).not.toBeInTheDocument();
      });

      // Test Generate Report button click
      const generateReportButton = screen.getByText('Generate Report');
      await user.click(generateReportButton);

      // Verify jsPDF was called (mocked)
      await waitFor(() => {
        expect(mockJsPDF).toHaveBeenCalled();
      });
    });

    it('should disable generate report button when no data is available', async () => {
      // Mock empty data
      vi.mocked(garbageRequestApi.fetchGarbageCollectionData).mockResolvedValue([]);
      vi.mocked(garbageRequestApi.fetchGarbageCollectionDataApproved).mockResolvedValue([]);

      renderComponent({ isPendingData: true });

      await waitFor(() => {
        expect(screen.getByText('Waste Collection Requests')).toBeInTheDocument();
      });

      // Verify "Generate Report" button is disabled
      const generateReportButton = screen.getByText('Generate Report');
      expect(generateReportButton).toBeDisabled();

      // Verify "No records found" message
      expect(screen.getByText('No records found')).toBeInTheDocument();
    });
  });
});
