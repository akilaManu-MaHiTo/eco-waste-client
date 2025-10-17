import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PieChartCard from './PieChartCard';
import createWrapper from '../../../test/test-utils';

describe('PieChartCard', () => {
  it('shows loader, empty and chart states', () => {
    const wrapper = createWrapper();
    const { rerender } = render(<PieChartCard loading={true} error={false} pieChartData={[]} />, { wrapper });
    expect(screen.getByText(/Waste Distribution/i)).toBeInTheDocument();

    rerender(<PieChartCard loading={false} error={false} pieChartData={[]} />);
    expect(screen.getByText(/No distribution data available yet/i)).toBeInTheDocument();

    rerender(<PieChartCard loading={false} error={false} pieChartData={[{ name: 'Plastic', value: 12 }]} />);
    expect(screen.getByText(/Waste Distribution/i)).toBeInTheDocument();
  });
});
