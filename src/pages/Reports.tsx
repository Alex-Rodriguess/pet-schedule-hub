import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, FileText, Download } from 'lucide-react';
import { exportReportsToPDF } from '@/lib/pdfExport';

const mockReports = [
  { id: 1, title: 'Faturamento Mensal', value: 'R$ 12.500,00', date: '2025-08' },
  { id: 2, title: 'Total de Agendamentos', value: '320', date: '2025-08' },
  { id: 3, title: 'Pets Atendidos', value: '210', date: '2025-08' },
];

export default function ReportsPage() {
  const [filterMonth, setFilterMonth] = useState('2025-08');

  const filteredReports = mockReports.filter(r => r.date === filterMonth);

  const handleGeneratePDF = () => {
    exportReportsToPDF(filteredReports, filterMonth);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Relatórios
          </h1>
          <div className="flex items-center gap-2">
            <Input
              type="month"
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              className="w-32"
            />
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filtrar
            </Button>
            <Button variant="default" size="sm" className="flex items-center gap-1" onClick={handleGeneratePDF}>
              <Download className="h-4 w-4" /> Gerar PDF
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredReports.length > 0 ? filteredReports.map(report => (
            <Card key={report.id} className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" /> {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{report.value}</div>
                <div className="text-xs text-muted-foreground">Referente a {report.date}</div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-2 text-center text-muted-foreground py-8">Nenhum relatório encontrado para o filtro selecionado.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
