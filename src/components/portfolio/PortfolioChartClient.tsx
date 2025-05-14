'use client';

import type { Holding } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface PortfolioChartClientProps {
  holdings: (Holding & { currentValue: number; name: string })[];
  cash: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF']; // Pastel-ish colors

export default function PortfolioChartClient({ holdings, cash }: PortfolioChartClientProps) {
  const chartData = holdings.map(holding => ({
    name: holding.symbol, // Use symbol or name. Name might be too long.
    value: holding.currentValue,
  }));

  if (cash > 0) {
    chartData.push({ name: 'Tunai', value: cash });
  }
  
  if (chartData.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Belum ada data untuk ditampilkan di chart.</p>;
  }


  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p className="text-sm text-foreground">{`Nilai: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-xs text-muted-foreground">{`Persentase: ${(payload[0].percent * 100).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              if (percent * 100 < 5) return null; // Hide label for small slices
              return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{paddingTop: "20px"}}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
