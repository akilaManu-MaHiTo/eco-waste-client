import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrendChartCard from './TrendChartCard';
import createWrapper from '../../../test/test-utils';

describe('TrendChartCard', () => {
  it('shows loader, empty and chart states', () => {
    const wrapper = createWrapper();
    const { rerender } = render(<TrendChartCard loading={true} error={false} trendChartData={[]} theme={{ palette: { primary: { main: '#000' } } } as any} />, { wrapper });
    expect(screen.getByText(/Waste Generation Trend/i)).toBeInTheDocument();

    rerender(<TrendChartCard loading={false} error={false} trendChartData={[]} theme={{ palette: { primary: { main: '#000' } } } as any} />);
    expect(screen.getByText(/No waste generation data found/i)).toBeInTheDocument();

    rerender(<TrendChartCard loading={false} error={false} trendChartData={[{ date: '2024-10-01', totalWeight: 12 }]} theme={{ palette: { primary: { main: '#000' } } } as any} />);
    expect(screen.getByText(/Waste Generation Trend/i)).toBeInTheDocument();
  });
});
