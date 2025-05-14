import type { Stock } from '@/types';

const generateRandomChartData = (basePrice: number): { month: string; price: number }[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let lastPrice = basePrice;
  return months.map(month => {
    const price = Math.max(100, lastPrice + (Math.random() - 0.5) * (basePrice * 0.1)); // Fluctuate by +/- 10%
    lastPrice = price;
    return { month, price: parseFloat(price.toFixed(0)) };
  });
};


export const mockStocks: Stock[] = [
  {
    symbol: 'BBCA',
    name: 'Bank Central Asia Tbk.',
    price: 9250,
    chartData: generateRandomChartData(9250),
    logoUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'bank finance',
    marketCap: 1140 * 10**12, // Trillion IDR
    volume: 50 * 10**6, // Million shares
    description: 'Salah satu bank swasta terbesar di Indonesia, menyediakan berbagai layanan perbankan dan keuangan.',
  },
  {
    symbol: 'BBRI',
    name: 'Bank Rakyat Indonesia (Persero) Tbk.',
    price: 4300,
    chartData: generateRandomChartData(4300),
    logoUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'bank state',
    marketCap: 650 * 10**12,
    volume: 120 * 10**6,
    description: 'Bank milik negara dengan fokus pada usaha mikro, kecil, dan menengah (UMKM) di seluruh Indonesia.',
  },
  {
    symbol: 'TLKM',
    name: 'Telkom Indonesia (Persero) Tbk.',
    price: 2900,
    chartData: generateRandomChartData(2900),
    logoUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'telecom communication',
    marketCap: 287 * 10**12,
    volume: 90 * 10**6,
    description: 'Perusahaan telekomunikasi terbesar di Indonesia, menyediakan layanan seluler, internet, dan data.',
  },
  {
    symbol: 'ASII',
    name: 'Astra International Tbk.',
    price: 4400,
    chartData: generateRandomChartData(4400),
    logoUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'automotive conglomerate',
    marketCap: 178 * 10**12,
    volume: 60 * 10**6,
    description: 'Konglomerat multinasional dengan diversifikasi bisnis di sektor otomotif, jasa keuangan, alat berat, dan lainnya.',
  },
  {
    symbol: 'BMRI',
    name: 'Bank Mandiri (Persero) Tbk.',
    price: 5900,
    chartData: generateRandomChartData(5900),
    logoUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'bank finance',
    marketCap: 550 * 10**12,
    volume: 75 * 10**6,
    description: 'Salah satu bank BUMN terbesar di Indonesia, menawarkan produk dan layanan perbankan korporat dan ritel.',
  },
  {
    symbol: 'GOTO',
    name: 'GoTo Gojek Tokopedia Tbk.',
    price: 52,
    chartData: generateRandomChartData(52),
    logoUrl: 'https://placehold.co/40x40.png',
    dataAiHint: 'technology e-commerce',
    marketCap: 62 * 10**12,
    volume: 1.5 * 10**9, // Billion shares
    description: 'Perusahaan teknologi hasil merger Gojek dan Tokopedia, beroperasi di bidang ride-hailing, e-commerce, dan fintech.',
  },
];

// Function to simulate price updates
export const getUpdatedStockPrice = (currentPrice: number): number => {
  const changePercent = (Math.random() - 0.48) * 0.02; // Max 1% change up or down, slightly biased upwards
  let newPrice = currentPrice * (1 + changePercent);
  newPrice = Math.max(1, parseFloat(newPrice.toFixed(0))); // Ensure price is at least 1 and whole number for IDR
  return newPrice;
};
