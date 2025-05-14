'use client';

import { useState } from 'react';
import { summarizeInvestmentTrends } from '@/ai/flows/summarize-investment-trends';
import type { SummarizeInvestmentTrendsInput, SummarizeInvestmentTrendsOutput } from '@/ai/flows/summarize-investment-trends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AiSummaryClient() {
  const [ticker, setTicker] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSummary(null);

    try {
      const input: SummarizeInvestmentTrendsInput = ticker ? { ticker } : {};
      const result: SummarizeInvestmentTrendsOutput = await summarizeInvestmentTrends(input);
      setSummary(result.summary);
      toast({
        title: 'Ringkasan Dihasilkan',
        description: 'Ringkasan AI berhasil dibuat.',
      });
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast({
        title: 'Gagal Membuat Ringkasan',
        description: 'Terjadi kesalahan saat menghubungi layanan AI. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="ticker" className="text-base">Simbol Saham (Opsional)</Label>
          <Input
            id="ticker"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="Contoh: BBCA, TLKM (kosongkan untuk pasar umum)"
            className="mt-1 h-11 text-base"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Biarkan kosong untuk mendapatkan ringkasan pasar secara umum.
          </p>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto min-w-[180px] text-base py-3">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Memproses...' : 'Hasilkan Ringkasan'}
        </Button>
      </form>

      {isLoading && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="p-6 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-lg font-medium text-foreground">Sedang membuat ringkasan...</p>
            <p className="text-sm text-muted-foreground">Mohon tunggu sebentar.</p>
          </CardContent>
        </Card>
      )}

      {summary && !isLoading && (
        <Card className="bg-background border-2 border-primary/30 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
              <Sparkles className="h-6 w-6 mr-2" />
              Ringkasan AI
            </h3>
            <Textarea
              value={summary}
              readOnly
              className="min-h-[200px] text-base leading-relaxed bg-secondary/30 border-secondary p-3 rounded-md focus-visible:ring-primary"
              rows={10}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
