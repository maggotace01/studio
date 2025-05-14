import PageHeader from '@/components/PageHeader';
import AiSummaryClient from '@/components/ai/AiSummaryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiSummaryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Investasi AI"
        description="Dapatkan ringkasan tren pasar terkini atau aktivitas saham tertentu yang didukung oleh AI."
      />
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Analisis Tren Otomatis</CardTitle>
          <CardDescription>
            Masukkan simbol saham untuk analisis spesifik, atau kosongkan untuk ringkasan pasar secara keseluruhan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AiSummaryClient />
        </CardContent>
      </Card>
    </div>
  );
}
