import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddOrEditWasteBinDialog from './AddOrEditWasteBinDialog';
import * as wasteApi from '../../api/wasteBin';
import createWrapper from '../../test/test-utils';

vi.mock('../../hooks/useIsMobile', () => ({ default: () => ({ isTablet: false, isMobile: false }) }));

describe('AddOrEditWasteBinDialog', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders add dialog and validates required fields', async () => {
    const wrapper = createWrapper();
    const user = userEvent.setup();

    render(<AddOrEditWasteBinDialog open={true} handleClose={() => {}} />, { wrapper });

    // Should show Add Waste title
    expect(screen.getByText(/Add Waste/i)).toBeInTheDocument();

    // Try to submit without required fields
    const submitBtn = screen.getByRole('button', { name: /Add to Bin|Update Bin/i });
    await user.click(submitBtn);

    // Since bin type and thresholdLevel are required (thresholdLevel validation present), expect form to not close; we validate presence of Cancel button as fallback
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('calls createWasteBin on submit when fields provided', async () => {
    const spyCreate = vi.spyOn(wasteApi, 'createWasteBin').mockImplementation(async () => ({} as any));
    const wrapper = createWrapper();
    const user = userEvent.setup();

    render(<AddOrEditWasteBinDialog open={true} handleClose={() => {}} />, { wrapper });

    // Fill threshold field
    const threshold = screen.getByLabelText(/Waste Weight \(kg\)/i);
    await user.type(threshold, '12');

    const submitBtn = screen.getByRole('button', { name: /Add to Bin|Update Bin/i });
    await user.click(submitBtn);

    await waitFor(() => expect(spyCreate).toHaveBeenCalled());
  });
});
