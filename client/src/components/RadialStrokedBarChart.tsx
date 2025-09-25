import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

interface RadialBarChartProps {
  value: number;
  size?: number;
  label?: string;
}

const RadialStrokeBarChart: React.FC<RadialBarChartProps> = ({
  value,
  size = 350,
  label = 'Median Ratio'
}) => {
  const [chartState, setChartState] = useState({
    series: [value],
    options: {
      chart: {
        height: size,
        type: 'radialBar' as const,
        offsetY: -10
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 120
            },
            value: {
              offsetY: 76,
              fontSize: '22px',
              color: undefined,
              formatter: function (val: number) {
                return val + "%";
              }
            }
          }
        }
      },
      fill: {
        type: 'gradient' as const,
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        }
      },
      stroke: {
        dashArray: 4
      },
      labels: [label],
    }
  });

  useEffect(() => {
    setChartState((prev) => ({
      ...prev,
      series: [value],
      options: {
        ...prev.options,
        chart: {
          ...prev.options.chart,
          height: size
        },
        labels: [label]
      }
    }));
  }, [value, size, label]);

  return (
    <div className="radial-bar-chart">
      <Chart
        options={chartState.options}
        series={chartState.series}
        type="radialBar"
        height={size}
      />
    </div>
  );
};

export default RadialStrokeBarChart;
