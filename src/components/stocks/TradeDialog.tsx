'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import type { Stock, Portfolio } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { useToast } from '@/hooks/use-toast';

interface TradeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  stock: Stock;
  tradeType: 'BUY' | 'SELL';
  onConfirmTrade: (symbol: string, name: string, quantity: number, price: number) => void;
  portfolio: Portfolio;
}

export default function TradeDialog({
  isOpen,
  onOpenChange,
  stock,
  tradeType,
  onConfirmTrade,
  portfolio,
}: TradeDialogProps) {
  const [quantity, setQuantity] = useState(100); // Default 1 lot = 100 shares
  const [totalAmount, setTotalAmount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (stock && quantity > 0) {
      setTotalAmount(quantity * stock.price);
    } else {
      setTotalAmount(0);
    }
  }, [stock, quantity]);
  
  // Reset quantity when dialog opens or stock changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(100); 
    }
  }, [isOpen, stock]);


  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) { // Allow 0 for clearing input
      setQuantity(value);
    } else if (e.target.value === '') {
      setQuantity(0);
    }
  };

  const handleSubmit = () => {
    if (quantity <= 0) {
      toast({ title: 'Input Tidak Valid', description: 'Jumlah harus lebih dari 0.', variant: 'destructive' });
      return;
    }

    if (tradeType === 'BUY') {
      if (portfolio.cash < totalAmount) {
        toast({ title: 'Dana Tidak Cukup', description: 'Dana Anda tidak mencukupi untuk transaksi ini.', variant: 'destructive' });
        return;
      }
    } else { // SELL
      const holding = portfolio.holdings.find(h => h.symbol === stock.symbol);
      if (!holding || holding.quantity < quantity) {
        toast({ title: 'Saham Tidak Cukup', description: 'Jumlah saham yang Anda miliki tidak mencukupi.', variant: 'destructive' });
        return;
      }
    }

    onConfirmTrade(stock.symbol, stock.name, quantity, stock.price);
    onOpenChange(false);
  };

  const maxSellQuantity = portfolio.holdings.find(h => h.symbol === stock.symbol)?.quantity || 0;
  const maxBuyLots = Math.floor(portfolio.cash / (stock.price * 100)); // Max lots user can buy

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {tradeType === 'BUY' ? 'Beli Saham' : 'Jual Saham'} - {stock.symbol}
          </DialogTitle>
          <DialogDescription>
            {stock.name} - Harga Saat Ini: {formatCurrency(stock.price)} / lembar
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-base">
              Jumlah Lembar (1 lot = 100 lembar)
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="text-base h-11"
              min="0"
              step="100" // Increment by lots
            />
            {tradeType === 'SELL' && <p className="text-xs text-muted-foreground">Maksimum jual: {formatNumber(maxSellQuantity,0)} lembar.</p>}
             {tradeType === 'BUY' && <p className="text-xs text-muted-foreground">Dana tersedia: {formatCurrency(portfolio.cash)}. Maks: {formatNumber(maxBuyLots,0)} lot.</p>}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Estimasi:</p>
            <p className="text-xl font-semibold text-primary">{formatCurrency(totalAmount)}</p>
          </div>
          
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">Batal</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            Konfirmasi {tradeType === 'BUY' ? 'Beli' : 'Jual'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
