import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PieChartCard from './PieChartCard';
import createWrapper from '../../../test/test-utils';

// Mock the CustomPieChart used inside PieChartCard to avoid relying on chart library in tests
vi.mock('../../../components/CustomPieChart', () => ({
  __esModule: true,
  default: (props: any) => {
    return (
      <div data-testid="custom-pie">
        {props.data?.map((d: any) => (
          <div key={d.name} data-testid="pie-segment">
            <span>{d.name}</span>
            <span>{d.value}</span>
          </div>
        ))}
      </div>
    );
  },
}));

describe('PieChartCard', () => {
  const wrapper = createWrapper();

  it('shows loader and empty states', () => {
    const { rerender, container } = render(<PieChartCard loading={true} error={false} pieChartData={[]} />, { wrapper });
    // Header in component is 'Waste Distribution'
    expect(screen.getByText(/Waste Distribution/i)).toBeInTheDocument();
    // Skeleton present
    expect(container.querySelector('.MuiSkeleton-root')).toBeTruthy();

    rerender(<PieChartCard loading={false} error={false} pieChartData={[]} />);
    expect(screen.getByText(/No distribution data available yet/i)).toBeInTheDocument();
  });

  it('renders pie segments when data present', () => {
    const breakdown = [
      { name: 'Plastic', value: 60 },
      { name: 'Organic', value: 40 },
    ];
    render(<PieChartCard loading={false} error={false} pieChartData={breakdown} />, { wrapper });

    expect(screen.getByTestId('custom-pie')).toBeInTheDocument();
    const segments = screen.getAllByTestId('pie-segment');
    expect(segments.length).toBe(2);
    expect(screen.getByText('Plastic')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('shows error message when error true', () => {
    render(<PieChartCard loading={false} error={true} pieChartData={[]} />, { wrapper });
    expect(screen.getByText(/Unable to load distribution breakdown/i)).toBeInTheDocument();
  });
});
