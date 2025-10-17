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
});
