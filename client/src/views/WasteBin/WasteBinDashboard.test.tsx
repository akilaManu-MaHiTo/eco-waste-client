import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import WasteBinDashboard from './WasteBinDashboard';
import createWrapper from '../../test/test-utils';
import * as garbageApi from '../../api/garbage';
import useCurrentUser from '../../hooks/useCurrentUser';

vi.mock('../../hooks/useCurrentUser');

describe('WasteBinDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders summary cards and handles transformed data', async () => {
    const wrapper = createWrapper();

  // Mock user
  (useCurrentUser as any).mockReturnValue({ user: { _id: 'u1', email: 'a@b.com' }, status: 'success' });

  // Mock APIs using spyOn to override implementations
  vi.spyOn(garbageApi, 'fetchgetCurrentGarbageLevel').mockResolvedValue({ overall: { percentFilled: 55 }, bins: [] } as any);
  vi.spyOn(garbageApi, 'fetchCurrentSummary').mockResolvedValue({ totals: { totalWeight: 100 }, summary: [{ category: 'Plastic', totalWeight: 60, count: 3 }] } as any);
  vi.spyOn(garbageApi, 'fetchgetGarbageTrend').mockResolvedValue({ startDate: '2024-09-01', endDate: '2024-09-30', trend: [{ date: '2024-09-01', categories: [{ category: 'Plastic', totalWeight: 10 }] }] } as any);
  vi.spyOn(garbageApi, 'fetchGarbage').mockResolvedValue([{ _id: 'g1', createdAt: '2024-09-20T10:00:00Z', status: 'Collected', garbageCategory: 'Plastic', wasteWeight: 12, binId: { binId: 'BIN-1' } }] as any);

    render(<WasteBinDashboard />, { wrapper });

    await waitFor(() => expect(screen.getByText(/Waste Management Dashboard/i)).toBeInTheDocument());

    // Ensure transformed category breakdown renders
    expect(screen.getByText(/Waste Categories/i)).toBeInTheDocument();
    // Percent displayed in categories card (there may be multiple 'Plastic' occurrences)
    await waitFor(async () => {
      const items = await screen.findAllByText('Plastic');
      expect(items.length).toBeGreaterThanOrEqual(1);
    });

    // Check that user email is displayed
    expect(screen.getByText(/Signed in as a@b.com/i)).toBeInTheDocument();
  });

  it('handles empty API responses without crashing', async () => {
    const wrapper = createWrapper();
    (useCurrentUser as any).mockReturnValue({ user: { _id: 'u1', email: 'a@b.com' }, status: 'success' });

    vi.spyOn(garbageApi, 'fetchgetCurrentGarbageLevel').mockResolvedValue({ overall: { percentFilled: 0 }, bins: [] } as any);
    vi.spyOn(garbageApi, 'fetchCurrentSummary').mockResolvedValue({ totals: { totalWeight: 0 }, summary: [] } as any);
    vi.spyOn(garbageApi, 'fetchgetGarbageTrend').mockResolvedValue({ startDate: '', endDate: '', trend: [] } as any);
    vi.spyOn(garbageApi, 'fetchGarbage').mockResolvedValue([] as any);

    render(<WasteBinDashboard />, { wrapper });

    await waitFor(() => expect(screen.getByText(/Waste Management Dashboard/i)).toBeInTheDocument());
    expect(screen.getByText(/Waste Categories/i)).toBeInTheDocument();
  });

  it('shows fallback when user missing and handles API errors', async () => {
    const wrapper = createWrapper();
    (useCurrentUser as any).mockReturnValue({ user: null, status: 'success' });

    vi.spyOn(garbageApi, 'fetchgetCurrentGarbageLevel').mockRejectedValue(new Error('api fail') as any);
    vi.spyOn(garbageApi, 'fetchCurrentSummary').mockRejectedValue(new Error('api fail') as any);
    vi.spyOn(garbageApi, 'fetchgetGarbageTrend').mockRejectedValue(new Error('api fail') as any);
    vi.spyOn(garbageApi, 'fetchGarbage').mockRejectedValue(new Error('api fail') as any);

    render(<WasteBinDashboard />, { wrapper });

    await waitFor(() => expect(screen.getByText(/Waste Management Dashboard/i)).toBeInTheDocument());
    // With missing user, the signed in text should not show
    expect(screen.queryByText(/Signed in as/i)).toBeNull();
  });
});
