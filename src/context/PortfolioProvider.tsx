'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Portfolio, Holding, Transaction, Stock } from '@/types';
import { mockStocks, getUpdatedStockPrice } from '@/data/mockStocks';
import { useToast } from '@/hooks/use-toast';

const INITIAL_CASH = 100_000_000; // Rp 100 Juta

interface PortfolioContextType {
  portfolio: Portfolio;
  allStocks: Stock[];
  buyStock: (symbol: string, name: string, quantity: number, price: number) => void;
  sellStock: (symbol: string, name: string, quantity: number, price: number) => void;
  loading: boolean;
  getStockBySymbol: (symbol: string) => Stock | undefined;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: INITIAL_CASH,
    holdings: [],
    transactions: [],
    initialCash: INITIAL_CASH,
  });
  const [allStocks, setAllStocks] = useState<Stock[]>(mockStocks);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const savedPortfolio = localStorage.getItem('IndoSimVestPortfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('IndoSimVestPortfolio', JSON.stringify(portfolio));
    }
  }, [portfolio, loading]);

  // Simulate real-time stock price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAllStocks(prevStocks =>
        prevStocks.map(stock => {
          const newPrice = getUpdatedStockPrice(stock.price);
          return {
            ...stock,
            lastPrice: stock.price,
            price: newPrice,
            change: newPrice - (stock.lastPrice || newPrice),
            changePercent: stock.lastPrice ? ((newPrice - stock.lastPrice) / stock.lastPrice) * 100 : 0,
          };
        })
      );

      // Update current price in holdings
      setPortfolio(prev => ({
        ...prev,
        holdings: prev.holdings.map(h => {
          const currentStock = allStocks.find(s => s.symbol === h.symbol);
          return { ...h, currentPrice: currentStock?.price || h.currentPrice };
        })
      }));

    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [allStocks]); // Rerun if allStocks reference changes (e.g. initial load)

  const getStockBySymbol = useCallback((symbol: string): Stock | undefined => {
    return allStocks.find(stock => stock.symbol === symbol);
  }, [allStocks]);

  const buyStock = (symbol: string, name: string, quantity: number, price: number) => {
    const totalCost = quantity * price;
    if (portfolio.cash < totalCost) {
      toast({ title: 'Gagal Beli', description: 'Dana tidak mencukupi.', variant: 'destructive' });
      return;
    }

    setPortfolio(prev => {
      const existingHolding = prev.holdings.find(h => h.symbol === symbol);
      let newHoldings: Holding[];

      if (existingHolding) {
        const totalQuantity = existingHolding.quantity + quantity;
        const totalValue = existingHolding.avgBuyPrice * existingHolding.quantity + totalCost;
        newHoldings = prev.holdings.map(h =>
          h.symbol === symbol
            ? { ...h, quantity: totalQuantity, avgBuyPrice: totalValue / totalQuantity, currentPrice: price }
            : h
        );
      } else {
        newHoldings = [...prev.holdings, { symbol, name, quantity, avgBuyPrice: price, currentPrice: price }];
      }

      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        symbol,
        name,
        type: 'BUY',
        quantity,
        price,
        totalAmount: totalCost,
      };

      return {
        ...prev,
        cash: prev.cash - totalCost,
        holdings: newHoldings,
        transactions: [newTransaction, ...prev.transactions],
      };
    });
    toast({ title: 'Berhasil Beli', description: `Membeli ${quantity} lembar ${symbol} @ ${price}.` });
  };

  const sellStock = (symbol: string, name: string, quantity: number, price: number) => {
    const holding = portfolio.holdings.find(h => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      toast({ title: 'Gagal Jual', description: 'Jumlah saham tidak mencukupi.', variant: 'destructive' });
      return;
    }

    const totalProceeds = quantity * price;
    setPortfolio(prev => {
      const newHoldings = prev.holdings
        .map(h =>
          h.symbol === symbol
            ? { ...h, quantity: h.quantity - quantity, currentPrice: price }
            : h
        )
        .filter(h => h.quantity > 0);

      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        symbol,
        name,
        type: 'SELL',
        quantity,
        price,
        totalAmount: totalProceeds,
      };

      return {
        ...prev,
        cash: prev.cash + totalProceeds,
        holdings: newHoldings,
        transactions: [newTransaction, ...prev.transactions],
      };
    });
    toast({ title: 'Berhasil Jual', description: `Menjual ${quantity} lembar ${symbol} @ ${price}.` });
  };


  return (
    <PortfolioContext.Provider value={{ portfolio, allStocks, buyStock, sellStock, loading, getStockBySymbol }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
