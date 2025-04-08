
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartData } from '@/types/traceability';

interface ChartProps {
  data: ChartData[];
  width?: number | string;
  height?: number;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  barColor?: string;
}

export const Chart: React.FC<ChartProps> = ({
  data,
  width = '100%',
  height = 300,
  title,
  xAxisLabel,
  yAxisLabel,
  barColor = '#4f46e5'
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-md font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -10 } : undefined} />
          <YAxis label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '8px',
            }}
          />
          <Bar dataKey="value" fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
