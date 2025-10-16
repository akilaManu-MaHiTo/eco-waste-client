import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { MemoryRouter } from 'react-router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GarbageTable from './GarbageTable';
import * as garbageApi from '../../api/garbage';

// Mock the API module
vi.mock('../../api/garbage');

// Mock the custom hooks
vi.mock('../../hooks/useCurrentUserHaveAccess', () => ({
  default: vi.fn(() => true), // Default to having access
}));

// Mock components that aren't critical for these tests
vi.mock('../../components/PageTitle', () => ({
  default: ({ title }: any) => <h1>{title}</h1>,
}));

vi.mock('../../components/BreadCrumb', () => ({
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

vi.mock('./AddOrEditGarbageDialog', () => ({
  default: ({ open, handleClose }: any) =>
    open ? (
      <div data-testid="add-edit-dialog">
        <button onClick={handleClose}>Close Dialog</button>
      </div>
    ) : null,
}));

vi.mock('./ViewGarbageContent', () => ({
  default: ({ garbage }: any) => (
    <div data-testid="view-garbage-content">
      <div>Garbage ID: {garbage._id}</div>
      <div>Category: {garbage.garbageCategory}</div>
    </div>
  ),
}));

vi.mock('../../components/ViewDataDrawer', () => ({
  default: ({ open, drawerContent }: any) =>
    open ? <div data-testid="view-drawer">{drawerContent}</div> : null,
  DrawerHeader: ({ title, onEdit, onDelete, handleClose }: any) => (
    <div data-testid="drawer-header">
      <h2>{title}</h2>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
      <button onClick={handleClose}>Close</button>
    </div>
  ),
}));

vi.mock('../../components/DeleteConfirmationModal', () => ({
  default: ({ open, handleClose, deleteFunc }: any) =>
    open ? (
      <div data-testid="delete-modal">
        <button onClick={deleteFunc}>Confirm Delete</button>
        <button onClick={handleClose}>Cancel</button>
      </div>
    ) : null,
}));

// Sample test data
const mockGarbageData = [
  {
    _id: 'garbage-001',
    createdAt: '2024-10-15T10:00:00Z',
    garbageCategory: 'Plastic',
    binId: {
      _id: 'bin-001',
      binId: 'BIN-001',
    },
    wasteWeight: 50,
    status: 'Pending',
  },
  {
    _id: 'garbage-002',
    createdAt: '2024-10-16T11:00:00Z',
    garbageCategory: 'Organic',
    binId: {
      _id: 'bin-002',
      binId: 'BIN-002',
    },
    wasteWeight: 75,
    status: 'Collected',
  },
  {
    _id: 'garbage-003',
    createdAt: '2024-10-17T12:00:00Z',
    garbageCategory: 'Metal',
    binId: {
      _id: 'bin-003',
      binId: 'BIN-003',
    },
    wasteWeight: 100,
    status: 'Requested',
  },
];

const mockTodayGarbageData = [
  {
    _id: 'today-001',
    createdAt: '2024-10-17T08:00:00Z',
    garbageCategory: 'Glass',
    binId: {
      _id: 'bin-004',
      binId: 'BIN-004',
    },
    wasteWeight: 30,
    status: 'Pending',
  },
];

// Test wrapper component
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
          <MemoryRouter>{children}</MemoryRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('GarbageTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render waste management table with garbage data and allow CSV export', async () => {
    // Mock the API calls
    vi.mocked(garbageApi.fetchGarbage).mockResolvedValue(mockGarbageData);

    // Mock URL and Blob for CSV download
    const mockCreateObjectURL = vi.fn((blob: Blob) => 'mock-url');
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL as any;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document.createElement for download link
    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);

    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'a') {
        const anchor = originalCreateElement('a');
        anchor.click = mockClick;
        return anchor;
      }
      return originalCreateElement(tagName);
    });

    const user = userEvent.setup();

    // Create a container for this test
    const container = document.createElement('div');
    document.body.appendChild(container);

    const { container: renderContainer } = render(
      <GarbageTable isGarbage={true} isTodayGarbage={false} />,
      { wrapper: createWrapper(), container }
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Waste Management')).toBeInTheDocument();
    });

    // Check if table headers are rendered
    expect(screen.getByText('Reference')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Waste Category')).toBeInTheDocument();
    expect(screen.getByText('Bin Number')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check if garbage data is displayed in the table
    await waitFor(() => {
      expect(screen.getByText('garbage-001')).toBeInTheDocument();
      expect(screen.getByText('Plastic')).toBeInTheDocument();
      expect(screen.getByText('BIN-001')).toBeInTheDocument();
      expect(screen.getByText('50 Kg')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    // Check if other records are displayed
    expect(screen.getByText('garbage-002')).toBeInTheDocument();
    expect(screen.getByText('Organic')).toBeInTheDocument();
    expect(screen.getByText('garbage-003')).toBeInTheDocument();
    expect(screen.getByText('Metal')).toBeInTheDocument();

    // Test CSV export functionality
    const exportCSVButton = screen.getByRole('button', { name: /export csv/i });
    expect(exportCSVButton).toBeInTheDocument();
    expect(exportCSVButton).not.toBeDisabled();

    // Click export CSV button
    await user.click(exportCSVButton);

    // Verify CSV export was triggered
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    // Verify the Blob was created with CSV content
    if (mockCreateObjectURL.mock.calls.length > 0) {
      const blobCall = mockCreateObjectURL.mock.calls[0][0] as Blob;
      expect(blobCall).toBeInstanceOf(Blob);
      expect(blobCall.type).toBe('text/csv');
    }
  });

  it('should display waste records with correct status chips and handle pagination', async () => {
    // Mock the API calls with multiple records to test pagination
    vi.mocked(garbageApi.fetchGarbage).mockResolvedValue(mockGarbageData);

    // Create a container for this test
    const container = document.createElement('div');
    document.body.appendChild(container);

    render(
      <GarbageTable isGarbage={true} isTodayGarbage={false} />,
      { wrapper: createWrapper(), container }
    );

    // Wait for data to load - check for table headers first
    await waitFor(() => {
      expect(screen.getByText('Reference')).toBeInTheDocument();
    });

    // Check if different status chips are rendered correctly
    await waitFor(() => {
      // "Pending" status chip
      const pendingChip = screen.getByText('Pending');
      expect(pendingChip).toBeInTheDocument();

      // "Collected" status chip
      const collectedChip = screen.getByText('Collected');
      expect(collectedChip).toBeInTheDocument();

      // "Requested" status chip  
      const requestedChip = screen.getByText('Requested');
      expect(requestedChip).toBeInTheDocument();
    });

    // Verify all three garbage records are displayed
    expect(screen.getByText('garbage-001')).toBeInTheDocument();
    expect(screen.getByText('garbage-002')).toBeInTheDocument();
    expect(screen.getByText('garbage-003')).toBeInTheDocument();

    // Verify pagination controls are present
    await waitFor(() => {
      const paginationElement = screen.getByText(/rows per page/i);
      expect(paginationElement).toBeInTheDocument();
    });

    // Verify the total count in pagination shows 3 records
    expect(screen.getByText(/1[–-]3 of 3/i)).toBeInTheDocument();
  });
});
