import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function AgendamentosTable({ filterMonth, petshopId }: { filterMonth: string, petshopId: string }) {
  const [loading, setLoading] = useState(true);
  type Appointment = {
    id: string;
    appointment_date: string;
    start_time: string;
    price: number;
    status: string;
    pet?: { name: string };
    service?: { name: string };
  };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setError(null);
      const [year, month] = filterMonth.split('-');
      const { data, error } = await supabase
        .from('appointments')
        .select('id, appointment_date, start_time, price, status, pet:pets(name), service:services(name)')
        .eq('petshop_id', petshopId)
        .gte('appointment_date', `${year}-${month}-01`)
        .lte('appointment_date', `${year}-${month}-31`)
        .order('appointment_date', { ascending: false });
      if (error) setError('Erro ao carregar agendamentos');
      setAppointments(data || []);
      setLoading(false);
    }
    if (petshopId) fetchAppointments();
  }, [filterMonth, petshopId]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) {
      setAppointments(apps => apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } else {
      alert('Erro ao atualizar status');
    }
  };

  if (loading) return <div className="text-center py-6">Carregando agendamentos...</div>;
  if (error) return <div className="text-center text-destructive py-6">{error}</div>;
  if (!appointments.length) return <div className="text-center py-6 text-muted-foreground">Nenhum agendamento encontrado para o mês selecionado.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded shadow">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Pet</th>
            <th className="p-2 text-left">Serviço</th>
            <th className="p-2 text-left">Data</th>
            <th className="p-2 text-left">Horário</th>
            <th className="p-2 text-left">Valor</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Alterar Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id} className="border-b">
              <td className="p-2">{a.pet?.name || '-'}</td>
              <td className="p-2">{a.service?.name || '-'}</td>
              <td className="p-2">{a.appointment_date}</td>
              <td className="p-2">{a.start_time}</td>
              <td className="p-2">R$ {a.price}</td>
              <td className="p-2">{a.status}</td>
              <td className="p-2">
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={a.status}
                  onChange={e => handleStatusChange(a.id, e.target.value)}
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
