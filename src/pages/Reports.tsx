import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Filter, FileText, Download } from 'lucide-react';
import { exportReportsToPDF } from '@/lib/pdfExport';

import { usePetshop } from '@/hooks/usePetshop';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function ReportsPage() {
  const [filterMonth, setFilterMonth] = useState('2025-08');
  const [pendingMonth, setPendingMonth] = useState('2025-08');
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([
    { id: 1, title: 'Faturamento Mensal', value: 'R$ 0,00', date: filterMonth },
    { id: 2, title: 'Total de Agendamentos', value: '0', date: filterMonth },
    { id: 3, title: 'Pets Atendidos', value: '0', date: filterMonth },
  ]);
  const { petshop } = usePetshop();

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      const [year, month] = filterMonth.split('-');
      // Busca agendamentos do mês e petshop
      const { data: appointmentsRaw, error: appointmentsError } = await supabase
        .from('appointments')
        .select('price, pet_id, status')
        .eq('petshop_id', petshop?.id)
        .gte('appointment_date', `${year}-${month}-01`)
        .lte('appointment_date', `${year}-${month}-31`);

      // Busca vendas do mês e petshop
      const { data: salesRaw, error: salesError } = await supabase
        .from('sales')
        .select('final_amount, status')
        .eq('petshop_id', petshop?.id)
        .gte('created_at', `${year}-${month}-01`)
        .lte('created_at', `${year}-${month}-31`);

      const appointments = Array.isArray(appointmentsRaw) ? appointmentsRaw : [];
      const sales = Array.isArray(salesRaw) ? salesRaw : [];

      if (appointmentsError || salesError) {
        setReports([
          { id: 1, title: 'Faturamento Mensal', value: 'Erro', date: filterMonth },
          { id: 2, title: 'Total de Agendamentos', value: 'Erro', date: filterMonth },
          { id: 3, title: 'Pets Atendidos', value: 'Erro', date: filterMonth },
        ]);
        setLoading(false);
        return;
      }

      // Faturamento: soma dos preços dos agendamentos confirmados
      const faturamentoAgendamentos = appointments
        .filter(a => a.status === 'confirmed')
        .reduce((sum, a) => sum + (a.price || 0), 0);

      // Faturamento: soma dos valores finais das vendas concluídas
      const faturamentoVendas = sales
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + (s.final_amount || 0), 0);

      // Faturamento total
      const faturamentoTotal = faturamentoAgendamentos + faturamentoVendas;

      // Total de agendamentos
      const totalAgendamentos = appointments.length;

      // Pets atendidos únicos
      const petsUnicos = new Set(appointments.map(a => a.pet_id)).size;

      setReports([
        { id: 1, title: 'Faturamento Agendamentos', value: `R$ ${faturamentoAgendamentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, date: filterMonth },
        { id: 2, title: 'Faturamento Produtos PDV', value: `R$ ${faturamentoVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, date: filterMonth },
        { id: 3, title: 'Faturamento Mensal Total', value: `R$ ${faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, date: filterMonth },
        { id: 4, title: 'Total de Agendamentos', value: `${totalAgendamentos}`, date: filterMonth },
        { id: 5, title: 'Pets Atendidos', value: `${petsUnicos}`, date: filterMonth },
      ]);
      setLoading(false);
    }
    if (petshop?.id) fetchReports();
  }, [filterMonth, petshop]);

  const handleGeneratePDF = () => {
    exportReportsToPDF(reports, filterMonth);
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
              value={pendingMonth}
              onChange={e => setPendingMonth(e.target.value)}
              className="w-32"
            />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setFilterMonth(pendingMonth)}
              disabled={loading}
            >
              <Filter className="h-4 w-4" /> Filtrar
            </Button>
            <Button variant="default" size="sm" className="flex items-center gap-1" onClick={handleGeneratePDF}>
              <Download className="h-4 w-4" /> Gerar PDF
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 text-center text-muted-foreground py-8">Carregando...</div>
          ) : reports.length > 0 ? reports.map(report => (
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
