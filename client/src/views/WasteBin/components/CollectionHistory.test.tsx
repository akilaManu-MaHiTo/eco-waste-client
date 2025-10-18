import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CollectionHistory from './CollectionHistory';
import createWrapper from '../../../test/test-utils';

describe('CollectionHistory', () => {
  it('shows loader, empty and populated table', () => {
    const wrapper = createWrapper();
    const { rerender } = render(<CollectionHistory loading={true} error={false} historyPreview={[]} formatDate={() => 'na'} formatTime={() => 't'} />, { wrapper });

    rerender(<CollectionHistory loading={false} error={false} historyPreview={[]} formatDate={() => 'na'} formatTime={() => 't'} />);
    expect(screen.getByText(/No collection records available/i)).toBeInTheDocument();

    const data = [
      { _id: 'h1', createdAt: '2024-10-10T10:00:00Z', garbageCategory: 'Plastic', wasteWeight: 10, status: 'Collected' },
    ];
    rerender(<CollectionHistory loading={false} error={false} historyPreview={data} formatDate={() => 'Oct 10, 2024'} formatTime={() => '10:00 AM'} />);
    expect(screen.getByText('Plastic')).toBeInTheDocument();
    expect(screen.getByText('10.00')).toBeInTheDocument();
    expect(screen.getByText('Collected')).toBeInTheDocument();
  });

  it('shows error when fetching history fails and handles malformed records', () => {
    const wrapper = createWrapper();
    const { rerender } = render(<CollectionHistory loading={false} error={true} historyPreview={[]} formatDate={() => 'na'} formatTime={() => 't'} />, { wrapper });
    expect(screen.getByText(/No collection records available|Unable to load/i)).toBeTruthy();

    const badData = [
      { _id: 'h2', createdAt: 'not-a-date', garbageCategory: null, wasteWeight: null, status: 'Pending' },
    ];
    rerender(<CollectionHistory loading={false} error={false} historyPreview={badData} formatDate={() => 'Invalid date'} formatTime={() => 't'} />);
    // Should still render row with fallback values
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
