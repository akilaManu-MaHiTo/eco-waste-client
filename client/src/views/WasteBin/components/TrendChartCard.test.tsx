import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrendChartCard from './TrendChartCard';
import createWrapper from '../../../test/test-utils';

// Recharts' ResponsiveContainer and chart internals rely on layout measurements
// that jsdom doesn't provide. Mock the relevant pieces to deterministic stubs
// we can assert against (svg, path with stroke, axis ticks as text).
vi.mock('recharts', () => {
  const React = require('react');
  return {
    __esModule: true,
    // ResponsiveContainer will just render children
    ResponsiveContainer: (props: any) => React.createElement('div', { 'data-testid': 'responsive' }, props.children),
    // LineChart renders an svg containing whatever children are passed
    LineChart: (props: any) => React.createElement('svg', { 'data-testid': 'line-chart' }, props.children),
    // XAxis renders ticks as <text> nodes using the dataKey values
    XAxis: ({ dataKey }: any) => React.createElement('g', { 'data-testid': 'x-axis' }, React.createElement('text', null, dataKey)),
    YAxis: () => React.createElement('g', { 'data-testid': 'y-axis' }, React.createElement('text', null, 'y')), 
    Tooltip: () => React.createElement('g', { 'data-testid': 'tooltip' }),
    // Line renders a path with stroke and strokeWidth attributes
    Line: ({ stroke, strokeWidth }: any) => {
      const props: any = { 'data-testid': 'line-path', stroke };
      if (strokeWidth !== undefined) props['stroke-width'] = strokeWidth;
      return React.createElement('path', props);
    },
  };
});

describe('TrendChartCard', () => {
  const wrapper = createWrapper();

  it('renders the title and loading skeleton', () => {
    const { container } = render(
      <TrendChartCard loading={true} error={false} trendChartData={[]} theme={{ palette: { primary: { main: '#000' } } } as any} />,
      { wrapper }
    );

    expect(screen.getByText(/Waste Generation Trend/i)).toBeInTheDocument();
    // Skeleton uses .MuiSkeleton-root class from MUI
    expect(container.querySelector('.MuiSkeleton-root')).toBeTruthy();
  });

  it('shows an error message when `error` is true', () => {
    render(
      <TrendChartCard loading={false} error={true} trendChartData={[]} theme={{ palette: { primary: { main: '#000' } } } as any} />,
      { wrapper }
    );

    expect(screen.getByText(/Unable to load trend data/i)).toBeInTheDocument();
  });

  it('renders empty state when there is no data', () => {
    render(
      <TrendChartCard loading={false} error={false} trendChartData={[]} theme={{ palette: { primary: { main: '#000' } } } as any} />,
      { wrapper }
    );

    expect(screen.getByText(/No waste generation data found for the selected period/i)).toBeInTheDocument();
  });

  it('renders a chart when data is present and uses theme color for the line', () => {
    const data = [
      { date: '2025-10-01', totalWeight: 12.3456 },
      { date: '2025-10-02', totalWeight: 3.1 },
    ];
    const theme = { palette: { primary: { main: '#123456' } } } as any;

    const { container } = render(
      <TrendChartCard loading={false} error={false} trendChartData={data} theme={theme} />,
      { wrapper }
    );

    // Chart container (svg) should be present
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();

    // The Line element renders as a path with stroke equal to the theme color and strokeWidth 3
    const coloredPath = container.querySelector(`path[data-testid="line-path"]`);
    expect(coloredPath).toBeTruthy();
    if (coloredPath) {
      expect(coloredPath.getAttribute('stroke')).toBe(theme.palette.primary.main);
      // strokeWidth is set as a property on the element
      expect(coloredPath.getAttribute('stroke-width') === '3' || coloredPath.getAttribute('stroke-width') === '3.0').toBeTruthy();
    }

    // Our mocked XAxis renders the dataKey as a text node ('date')
    const xAxis = container.querySelector('[data-testid="x-axis"]');
    expect(xAxis).toBeTruthy();
    expect(xAxis?.textContent).toContain('date');
  });

  it('renders start and end date caption when provided', () => {
    render(
      <TrendChartCard loading={false} error={false} trendChartData={[]} startDate="2025-10-01" endDate="2025-10-07" theme={{ palette: { primary: { main: '#000' } } } as any} />,
      { wrapper }
    );

    expect(screen.getByText(/2025-10-01 - 2025-10-07/)).toBeInTheDocument();
  });
});
