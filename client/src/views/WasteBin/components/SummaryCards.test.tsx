import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentLevelCard, LastCollectionCard, NextCollectionCard, WasteCategoriesCard } from './SummaryCards';
import createWrapper from '../../../test/test-utils';

describe('SummaryCards', () => {
  const wrapper = createWrapper();

  describe('CurrentLevelCard', () => {
    it('renders loading skeleton and then value', () => {
      const { rerender } = render(<CurrentLevelCard loading={true} error={false} overallPercentFilled={0} />, { wrapper });
      expect(screen.getByText(/Current Garbage Level/i)).toBeInTheDocument();

      rerender(<CurrentLevelCard loading={false} error={false} overallPercentFilled={42.7} />);
      expect(screen.getByText('43%')).toBeInTheDocument();
      expect(screen.getByText(/Container is 43% full/i)).toBeInTheDocument();
    });

    it('shows error message when error is true', () => {
      render(<CurrentLevelCard loading={false} error={true} overallPercentFilled={0} />, { wrapper });
      expect(screen.getByText(/Unable to load current garbage level/i)).toBeInTheDocument();
    });
  });

  describe('LastCollectionCard', () => {
    it('shows formatted last collection using formatDate/formatTime', () => {
      const last = { createdAt: '2025-10-10T10:00:00Z', binId: { binId: 'BIN-1' } } as any;
      render(<LastCollectionCard loading={false} error={false} lastCollected={last} formatDate={() => 'Oct 10, 2025'} formatTime={() => '10:00 AM'} />, { wrapper });
      expect(screen.getByText('Oct 10, 2025')).toBeInTheDocument();
      expect(screen.getByText(/Bin ID/i)).toBeInTheDocument();
      expect(screen.getByText('BIN-1')).toBeInTheDocument();
    });

    it('falls back when date is invalid and shows placeholder', () => {
      const last = { createdAt: 'invalid-date' } as any;
      render(<LastCollectionCard loading={false} error={false} lastCollected={last} formatDate={() => 'na'} formatTime={() => 't'} />, { wrapper });
      // formatDayTime returns undefined so formatTime fallback should be used
      expect(screen.getByText('t')).toBeInTheDocument();
    });

    it('shows error message when api fails', () => {
      render(<LastCollectionCard loading={false} error={true} lastCollected={null} formatDate={() => ''} formatTime={() => ''} />, { wrapper });
      expect(screen.getByText(/Unable to load collection history/i)).toBeInTheDocument();
    });
  });

  describe('NextCollectionCard', () => {
    it('renders next collection info and handles missing data', () => {
      const next = { createdAt: '2025-11-01T09:30:00Z', binId: { binId: 'BIN-2' } } as any;
      render(<NextCollectionCard loading={false} error={false} nextCollection={next} formatDate={() => 'Nov 1, 2025'} formatTime={() => '09:30 AM'} />, { wrapper });
      expect(screen.getByText('Nov 1, 2025')).toBeInTheDocument();
      expect(screen.getByText('BIN-2')).toBeInTheDocument();
    });

    it('shows no upcoming message when nextCollection is falsy', () => {
      render(<NextCollectionCard loading={false} error={false} nextCollection={null} formatDate={() => ''} formatTime={() => ''} />, { wrapper });
      expect(screen.getByText(/No upcoming collection requests/i)).toBeInTheDocument();
    });
  });

  describe('WasteCategoriesCard', () => {
    it('shows no categories when empty', () => {
      render(<WasteCategoriesCard loading={false} error={false} categoryBreakdown={[]} />, { wrapper });
      expect(screen.getByText(/No waste categories logged yet/i)).toBeInTheDocument();
    });

    it('renders top categories with percent values', () => {
      const breakdown = [
        { category: 'Plastic', percent: 55.5 },
        { category: 'Organic', percent: 30 },
      ];
      render(<WasteCategoriesCard loading={false} error={false} categoryBreakdown={breakdown} />, { wrapper });
      expect(screen.getByText('Plastic')).toBeInTheDocument();
      expect(screen.getByText('56%')).toBeInTheDocument();
      expect(screen.getByText('Organic')).toBeInTheDocument();
    });

    it('shows error when category API fails', () => {
      render(<WasteCategoriesCard loading={false} error={true} categoryBreakdown={[]} />, { wrapper });
      expect(screen.getByText(/Unable to load category summary/i)).toBeInTheDocument();
    });
  });
});
