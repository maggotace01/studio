'use client';

import { usePortfolio } from '@/context/PortfolioProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters';
import PageHeader from '@/components/PageHeader';
import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionsPage() {
  const { portfolio, loading } = usePortfolio();

  if (loading) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Transaksi" description="Catatan semua aktivitas jual beli saham Anda." />
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Daftar Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada transaksi.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Simbol</TableHead>
                    <TableHead>Nama Saham</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead className="text-right">Jumlah (Lembar)</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>{formatDate(tx.date)}</TableCell>
                      <TableCell className="font-medium">{tx.symbol}</TableCell>
                      <TableCell>{tx.name}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === 'BUY' ? 'default' : 'destructive'} 
                               className={tx.type === 'BUY' ? 'bg-green-500/80 hover:bg-green-500/90 text-white' : 'bg-red-500/80 hover:bg-red-500/90 text-white'}>
                          {tx.type === 'BUY' ? 'BELI' : 'JUAL'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(tx.quantity,0)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.totalAmount)}</TableCell>
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

function TransactionsSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader title="Riwayat Transaksi" description="Catatan semua aktivitas jual beli saham Anda." />
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 gap-4 items-center">
                <Skeleton className="h-5 w-full" /> 
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
