'use client';

import { usePortfolio } from '@/context/PortfolioProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import PortfolioChartClient from '@/components/portfolio/PortfolioChartClient';
import Image from 'next/image';

export default function PortfolioPage() {
  const { portfolio, loading, getStockBySymbol } = usePortfolio();

  if (loading) {
    return <PortfolioSkeleton />;
  }

  const totalPortfolioValue = portfolio.holdings.reduce((acc, holding) => {
    const stock = getStockBySymbol(holding.symbol);
    return acc + (stock ? stock.price : holding.currentPrice || holding.avgBuyPrice) * holding.quantity;
  }, 0) + portfolio.cash;

  const totalInitialInvestmentInHoldings = portfolio.holdings.reduce((acc, holding) => {
    return acc + holding.avgBuyPrice * holding.quantity;
  },0);
  
  const overallProfitLoss = totalPortfolioValue - portfolio.initialCash;
  const overallProfitLossPercent = portfolio.initialCash > 0 ? (overallProfitLoss / portfolio.initialCash) * 100 : 0;

  const holdingsWithDetails = portfolio.holdings.map(holding => {
    const stock = getStockBySymbol(holding.symbol);
    const currentPrice = stock ? stock.price : (holding.currentPrice || holding.avgBuyPrice);
    const currentValue = currentPrice * holding.quantity;
    const totalCost = holding.avgBuyPrice * holding.quantity;
    const profitLoss = currentValue - totalCost;
    const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
    return {
      ...holding,
      currentPrice,
      currentValue,
      profitLoss,
      profitLossPercent,
      logoUrl: stock?.logoUrl,
      dataAiHint: stock?.dataAiHint
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Portofolio Saya" description="Ringkasan aset investasi Anda." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Total Nilai Portofolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatCurrency(totalPortfolioValue)}</p>
            <p className={`text-sm mt-1 ${overallProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallProfitLoss >= 0 ? '+' : ''}{formatCurrency(overallProfitLoss)} ({formatNumber(overallProfitLossPercent, 2)}%)
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Dana Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(portfolio.cash)}</p>
          </CardContent>
        </Card>
         <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Modal Awal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(portfolio.initialCash)}</p>
          </CardContent>
        </Card>
      </div>

      {holdingsWithDetails.length > 0 && (
         <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Alokasi Aset</CardTitle>
            <CardDescription>Distribusi nilai investasi Anda saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <PortfolioChartClient holdings={holdingsWithDetails} cash={portfolio.cash} />
          </CardContent>
        </Card>
      )}


      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Kepemilikan Saham</CardTitle>
          <CardDescription>Daftar saham yang Anda miliki saat ini.</CardDescription>
        </CardHeader>
        <CardContent>
          {holdingsWithDetails.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Anda belum memiliki saham.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Simbol</TableHead>
                    <TableHead>Nama Saham</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Harga Beli Rata2</TableHead>
                    <TableHead className="text-right">Harga Saat Ini</TableHead>
                    <TableHead className="text-right">Nilai Saat Ini</TableHead>
                    <TableHead className="text-right">Untung/Rugi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdingsWithDetails.map((holding) => (
                    <TableRow key={holding.symbol}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {holding.logoUrl && <Image src={holding.logoUrl} alt={`${holding.name} logo`} width={24} height={24} className="rounded-full" data-ai-hint={holding.dataAiHint || 'logo company'}/>}
                           {holding.symbol}
                        </div>
                      </TableCell>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell className="text-right">{formatNumber(holding.quantity,0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.avgBuyPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.currentPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.currentValue)}</TableCell>
                      <TableCell className={`text-right font-medium ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {holding.profitLoss > 0 && <TrendingUp className="h-4 w-4" />}
                          {holding.profitLoss < 0 && <TrendingDown className="h-4 w-4" />}
                          {holding.profitLoss === 0 && <Minus className="h-4 w-4" />}
                          {formatCurrency(holding.profitLoss)} ({formatNumber(holding.profitLossPercent, 2)}%)
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PortfolioSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader title="Portofolio Saya" description="Ringkasan aset investasi Anda." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
           <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
           <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
