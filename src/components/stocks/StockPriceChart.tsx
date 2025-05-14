'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface StockPriceChartProps {
  data: { month: string; price: number }[];
  priceChange?: number;
}

export default function StockPriceChart({ data, priceChange = 0 }: StockPriceChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Data chart tidak tersedia.</div>;
  }
  
  const strokeColor = priceChange >= 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'; // Green for up/neutral, Red for down

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/80 backdrop-blur-sm p-2 rounded-md shadow-lg border border-border text-xs">
          <p className="font-medium">{`Bulan: ${label}`}</p>
          <p style={{ color: payload[0].stroke }}>{`Harga: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(value) => formatCurrency(value).replace('Rp', '')} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '3 3' }}/>
        <Line
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: strokeColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
