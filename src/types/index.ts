export interface Stock {
  symbol: string;
  name: string;
  price: number;
  chartData: { month: string; price: number }[]; // Example: [{ month: 'Jan', price: 100 }, ...]
  lastPrice?: number;
  change?: number;
  changePercent?: number;
  logoUrl?: string; // e.g., URL to a placeholder or actual logo
  marketCap?: number;
  volume?: number;
  description?: string; // Brief company description
}

export interface Holding {
  symbol: string;
  name: string; // Add name for easier display
  quantity: number;
  avgBuyPrice: number;
  currentPrice?: number; // To calculate current value and P/L
}

export interface Transaction {
  id: string; // Unique ID for the transaction
  date: string; // ISO string format for date
  symbol:string;
  name: string; // Stock name for display
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number; // Price per share at the time of transaction
  totalAmount: number; // quantity * price
}

export interface Portfolio {
  cash: number;
  holdings: Holding[];
  transactions: Transaction[];
  initialCash: number;
}

// For AI Summary
export type AISummaryRequest = {
  ticker?: string;
};

export type AISummaryResponse = {
  summary: string;
};
