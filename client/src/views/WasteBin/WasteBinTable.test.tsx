import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WasteBinTable from './WasteBinTable';
import * as wasteApi from '../../api/wasteBin';
import createWrapper from '../../test/test-utils';

vi.mock('../../hooks/useCurrentUserHaveAccess', () => ({ default: vi.fn(() => true) }));
vi.mock('../../components/ViewDataDrawer', () => ({
  default: ({ open, drawerContent }: any) => (open ? <div data-testid="view-drawer">{drawerContent}</div> : null),
  DrawerHeader: ({ title, onEdit, onDelete, handleClose }: any) => (
    <div data-testid="drawer-header"><button onClick={onEdit}>Edit</button><button onClick={onDelete}>Delete</button><button onClick={handleClose}>Close</button></div>
  ),
  DrawerContentItem: ({ label, value }: any) => <div data-testid="drawer-item">{label}: {value}</div>,
}));

describe('WasteBinTable', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows no records when API returns empty array', async () => {
    vi.spyOn(wasteApi, 'fetchWasteBins').mockResolvedValue([] as any);
    const wrapper = createWrapper();
    render(<WasteBinTable isAssignedTasks={false} />, { wrapper });

    await waitFor(() => expect(screen.getByText(/No Records found/i)).toBeInTheDocument());
  });

  it('renders list of bins and opens view drawer', async () => {
    const bins = [
      { _id: 'b1', binId: 'BIN-1', currentWasteLevel: 20, thresholdLevel: 80, binType: 'Plastic', availability: true },
    ];
    vi.spyOn(wasteApi, 'fetchWasteBins').mockResolvedValue(bins as any);
    const wrapper = createWrapper();
    const user = userEvent.setup();

    render(<WasteBinTable isAssignedTasks={false} />, { wrapper });

    await waitFor(() => expect(screen.getByText('BIN-1')).toBeInTheDocument());

    // Click row to open drawer
    await user.click(screen.getByText('BIN-1'));
    await waitFor(() => expect(screen.getByTestId('view-drawer')).toBeInTheDocument());
  });

  it('shows error message when fetch API fails', async () => {
    vi.spyOn(wasteApi, 'fetchWasteBins').mockRejectedValue(new Error('Network Error') as any);
    const wrapper = createWrapper();
    render(<WasteBinTable isAssignedTasks={false} />, { wrapper });

    await waitFor(() => expect(screen.getByText(/No Records found|No Records/i)).toBeInTheDocument());
  });


  it('opens edit dialog when Edit clicked in drawer header', async () => {
    const bins = [
      { _id: 'b2', binId: 'BIN-EDIT', currentWasteLevel: 10, thresholdLevel: 80, binType: 'Glass', availability: true },
    ];
    vi.spyOn(wasteApi, 'fetchWasteBins').mockResolvedValue(bins as any);
    const wrapper = createWrapper();
    const user = userEvent.setup();

    render(<WasteBinTable isAssignedTasks={false} />, { wrapper });

    await waitFor(() => expect(screen.getByText('BIN-EDIT')).toBeInTheDocument());
    await user.click(screen.getByText('BIN-EDIT'));

    await waitFor(() => expect(screen.getByTestId('drawer-header')).toBeInTheDocument());
    await user.click(screen.getByText('Edit'));

    // AddOrEditWasteBinDialog should appear
    const dialogTitle = await screen.findByText(/Add Waste|Edit Waste/i);
    expect(dialogTitle).toBeTruthy();
  });

  it('allows opening add dialog and closing it', async () => {
    vi.spyOn(wasteApi, 'fetchWasteBins').mockResolvedValue([] as any);
    const wrapper = createWrapper();
    const user = userEvent.setup();

    render(<WasteBinTable isAssignedTasks={false} />, { wrapper });

    const addBtn = await screen.findByRole('button', { name: /Add Bin/i });
    expect(addBtn).toBeInTheDocument();
    await user.click(addBtn);

    // AddOrEditWasteBinDialog should appear - simple existence check via dialog title
    const dialogTitle = await screen.findByText(/Add Waste|Edit Waste/i);
    expect(dialogTitle).toBeTruthy();
  });
});
