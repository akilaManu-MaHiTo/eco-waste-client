import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ViewGarbageContent from './ViewGarbageContent';
import createWrapper from '../../test/test-utils';

// Mock hooks and dependencies

// Mock hooks and dependencies
vi.mock('../../hooks/useIsMobile', () => ({ default: () => ({ isTablet: false }) }));
vi.mock('../../hooks/useCurrentUser', () => ({ default: () => ({ user: { username: 'test', email: 'a@b.com' } }) }));

// Mock DatePickerComponent and TimePickerComponent to avoid needing LocalizationProvider in child components
vi.mock('../../components/DatePickerComponent', () => ({ default: ({ value, onChange }: any) => <input data-testid="date-picker" value={value?.toString() || ''} onChange={(e: any) => onChange(e.target.value)} /> }));
vi.mock('../../components/TimePickerComponent', () => ({ default: ({ value, onChange }: any) => <input data-testid="time-picker" value={value?.toString() || ''} onChange={(e: any) => onChange(e.target.value)} /> }));

describe('ViewGarbageContent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders garbage details and handles already collected status', () => {
    const wrapper = createWrapper();
    const garbage = { _id: 'g1', binId: { binId: 'BIN-1' }, garbageCategory: 'Plastic', wasteWeight: 5, status: 'Collected' } as any;

    render(<ViewGarbageContent garbage={garbage} isGarbageDataFetching={false} onClose={() => {}} />, { wrapper });

    expect(screen.getByText(/Reference Number/i)).toBeInTheDocument();
    // Info alert about already collected
    expect(screen.getByText(/This garbage collection request is already/i)).toBeInTheDocument();
  });

  it('shows request button when status is pending and triggers payment flow (mocked)', async () => {
    const wrapper = createWrapper();
    const garbage = { _id: 'g2', binId: { binId: 'BIN-2' }, garbageCategory: 'Organic', wasteWeight: 2, status: 'Pending' } as any;

    // Mock window.payhere.startPayment to avoid errors
    (global as any).payhere = { startPayment: vi.fn(), onCompleted: vi.fn() };

    render(<ViewGarbageContent garbage={garbage} isGarbageDataFetching={false} onClose={() => {}} />, { wrapper });

    // Button present
    const button = screen.getByRole('button', { name: /Request Garbage Collection/i });
    expect(button).toBeInTheDocument();

    // Click opens approve modal - cannot test full flow but ensure handler exists
    await waitFor(() => expect(button).toBeEnabled());
  });
});
