'use client';

import type React from 'react';
import { useState, useMemo } from 'react';
import { usePortfolio } from '@/context/PortfolioProvider';
import type { Stock } from '@/types';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import StockCard from '@/components/stocks/StockCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function StocksPage() {
  const { allStocks, buyStock, sellStock, loading, portfolio } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return allStocks;
    return allStocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allStocks, searchTerm]);

  if (loading && allStocks.length === 0) { // Show skeleton only on initial load
    return <StocksSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Saham" description="Jelajahi dan simulasikan transaksi saham di pasar Indonesia." />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari saham (misal: BBCA atau Bank Central Asia)..."
          className="pl-10 w-full md:w-1/2 lg:w-1/3 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredStocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onBuy={buyStock}
              onSell={sellStock}
              portfolio={portfolio}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">Tidak ada saham yang cocok dengan pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}


function StocksSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader title="Daftar Saham" description="Jelajahi dan simulasikan transaksi saham di pasar Indonesia." />
      <Skeleton className="h-10 w-full md:w-1/2 lg:w-1/3 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="shadow-sm rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-20 w-full" /> {/* Chart placeholder */}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-20 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Minimal card structure for skeleton to avoid import errors
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);
const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);
const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);


