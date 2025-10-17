import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import createWrapper from '../../test/test-utils';

// The component file exports a default component (named ViewGarbageContent inside file)
import ViewWasteBinContent from './ViewWasteBinContent';

// Mock the responsive hook to keep layout deterministic
vi.mock('../../customHooks/useIsMobile', () => ({ default: () => ({ isTablet: false }) }));

// Mock the ViewDataDrawer components so we can assert rendered label/value pairs easily
vi.mock('../../components/ViewDataDrawer', () => ({
  DrawerContentItem: ({ label, value }: any) => (
    <div data-testid="drawer-item">{label}: {String(value)}</div>
  ),
}));

describe('ViewWasteBinContent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders waste bin details correctly', () => {
    const wrapper = createWrapper();

    const wasteBin = {
      _id: 'wb1',
      binId: 'BIN-1',
      binType: 'Plastic',
      thresholdLevel: 80,
    } as any;

    render(<ViewWasteBinContent wasteBin={wasteBin} />, { wrapper });

    // We mocked DrawerContentItem to render `label: value` so assert those strings
    expect(screen.getByText(/Reference Number: BIN-1/)).toBeInTheDocument();
    expect(screen.getByText(/Waste Bin ID: BIN-1/)).toBeInTheDocument();
    expect(screen.getByText(/Waste Type: Plastic/)).toBeInTheDocument();
    expect(screen.getByText(/Threshold Level \(L\): 80L/)).toBeInTheDocument();
  });

  it('handles missing fields (edge case) without crashing', () => {
    const wrapper = createWrapper();

    // thresholdLevel omitted to exercise edge behavior
    const wasteBin = {
      _id: 'wb2',
      binId: 'BIN-2',
      // binType missing
    } as any;

    render(<ViewWasteBinContent wasteBin={wasteBin} />, { wrapper });

    // Reference and ID should still render
    expect(screen.getByText(/Reference Number: BIN-2/)).toBeInTheDocument();
    expect(screen.getByText(/Waste Bin ID: BIN-2/)).toBeInTheDocument();

    // Missing binType results in 'undefined' being stringified by our mock
    expect(screen.getByText(/Waste Type: undefined/)).toBeInTheDocument();

    // Missing thresholdLevel results in 'undefinedL' per current implementation
    expect(screen.getByText(/Threshold Level \(L\): undefinedL/)).toBeInTheDocument();
  });
});
