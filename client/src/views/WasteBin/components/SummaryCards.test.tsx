import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CurrentLevelCard, LastCollectionCard, NextCollectionCard, WasteCategoriesCard } from './SummaryCards';
import createWrapper from '../../../test/test-utils';

describe('SummaryCards', () => {
  beforeEach(() => vi.clearAllMocks());

  it('CurrentLevelCard shows loader, error and value states', async () => {
    const wrapper = createWrapper();

  // loading state - skeleton is rendered
  const { rerender, container } = render(<CurrentLevelCard loading={true} error={false} overallPercentFilled={0} />, { wrapper });
  expect(container.querySelector('.MuiSkeleton-root')).toBeTruthy();

    // error state
    rerender(<CurrentLevelCard loading={false} error={true} overallPercentFilled={0} />);
    expect(screen.getByText(/Unable to load current garbage level/i)).toBeInTheDocument();

    // value state
    rerender(<CurrentLevelCard loading={false} error={false} overallPercentFilled={42.7} />);
    expect(screen.getByText('43%')).toBeInTheDocument();
    expect(screen.getByText(/Container is 43% full/i)).toBeInTheDocument();
  });

  it('LastCollectionCard handles missing lastCollected and formats', () => {
    const wrapper = createWrapper();
    render(<LastCollectionCard loading={false} error={false} lastCollected={null} formatDate={(v: any) => 'NA'} formatTime={(v: any) => 'T'} />, { wrapper });
    expect(screen.getByText(/No collection events recorded yet/i)).toBeInTheDocument();
  });

  it('NextCollectionCard shows upcoming bin id when present', () => {
    const wrapper = createWrapper();
    const next = { createdAt: '2024-10-10T10:00:00Z', binId: { binId: 'BIN-10' } };
    render(<NextCollectionCard loading={false} error={false} nextCollection={next} formatDate={() => 'Oct 10, 2024'} formatTime={() => '10:00 AM'} />, { wrapper });
    expect(screen.getByText('BIN-10')).toBeInTheDocument();
  });

  it('WasteCategoriesCard shows empty and populated states', () => {
    const wrapper = createWrapper();
    const { rerender } = render(<WasteCategoriesCard loading={false} error={false} categoryBreakdown={[]} />, { wrapper });
    expect(screen.getByText(/No waste categories logged yet/i)).toBeInTheDocument();

    rerender(<WasteCategoriesCard loading={false} error={false} categoryBreakdown={[{ category: 'Plastic', percent: 60, totalWeight: 12 }]} />);
    expect(screen.getByText('Plastic')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });
});
