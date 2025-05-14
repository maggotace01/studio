'use client';

import type React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import type { Stock, Portfolio } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import StockPriceChart from './StockPriceChart';
import TradeDialog from './TradeDialog';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StockCardProps {
  stock: Stock;
  onBuy: (symbol: string, name: string, quantity: number, price: number) => void;
  onSell: (symbol: string, name: string, quantity: number, price: number) => void;
  portfolio: Portfolio;
}

export default function StockCard({ stock, onBuy, onSell, portfolio }: StockCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');

  const priceChange = stock.change || 0;
  const priceChangePercent = stock.changePercent || 0;

  const handleOpenDialog = (type: 'BUY' | 'SELL') => {
    setTradeType(type);
    setDialogOpen(true);
  };

  const holding = portfolio.holdings.find(h => h.symbol === stock.symbol);

  return (
    <>
      <Card className="flex flex-col justify-between rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {stock.logoUrl && (
                  <Image
                    src={stock.logoUrl}
                    alt={`${stock.name} logo`}
                    width={40}
                    height={40}
                    className="rounded-full border"
                    data-ai-hint={stock.dataAiHint || "logo company"}
                  />
                )}
                <div>
                  <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                  <CardDescription className="text-xs line-clamp-1">{stock.name}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 pb-4">
            <div>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(stock.price)}</p>
              <div className={`flex items-center text-xs ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {priceChange > 0 && <TrendingUp className="h-3 w-3 mr-0.5" />}
                {priceChange < 0 && <TrendingDown className="h-3 w-3 mr-0.5" />}
                {priceChange === 0 && <Minus className="h-3 w-3 mr-0.5" />}
                {formatCurrency(priceChange)} ({formatNumber(priceChangePercent,2)}%)
              </div>
            </div>
            <div className="h-24 -mx-2"> {/* Negative margin to align chart with card padding */}
              <StockPriceChart data={stock.chartData} priceChange={priceChange} />
            </div>
            {holding && holding.quantity > 0 && (
              <p className="text-xs text-muted-foreground">
                Anda memiliki: {formatNumber(holding.quantity,0)} lembar
              </p>
            )}
          </CardContent>
        </div>
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" size="sm" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/30 hover:border-red-500/50" onClick={() => handleOpenDialog('SELL')} disabled={!holding || holding.quantity === 0}>
            Jual
          </Button>
          <Button variant="outline" size="sm" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/30 hover:border-green-500/50" onClick={() => handleOpenDialog('BUY')}>
            Beli
          </Button>
        </CardFooter>
      </Card>
      <TradeDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        stock={stock}
        tradeType={tradeType}
        onConfirmTrade={tradeType === 'BUY' ? onBuy : onSell}
        portfolio={portfolio}
      />
    </>
  );
}
