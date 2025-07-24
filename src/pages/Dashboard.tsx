import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  PawPrint,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Settings,
  BarChart3,
  Bell
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { usePetshop } from '@/hooks/usePetshop';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { petshop } = usePetshop();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    totalPets: 0,
    popularService: 'Banho e Tosa',
    appointmentsByStatus: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    }
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    if (petshop?.id) {
      loadData();
    }
  }, [petshop]);

  const loadData = async () => {
    if (!petshop?.id) return;

    try {
      // Carregar agendamentos
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .eq('petshop_id', petshop.id);

      // Carregar pets
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .eq('petshop_id', petshop.id);

      if (customersData?.length) {
        const customerIds = customersData.map(c => c.id);
        const { data: petsData } = await supabase
          .from('pets')
          .select('*')
          .in('customer_id', customerIds);
        setPets(petsData || []);
      }

      setAppointments(appointmentsData || []);

      // Calcular estatísticas
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      const currentMonth = format(today, 'yyyy-MM');

      const todayAppointments = appointmentsData?.filter(apt => 
        format(new Date(apt.appointment_date), 'yyyy-MM-dd') === todayStr
      ).length || 0;

      const monthlyAppointments = appointmentsData?.filter(apt => 
        format(new Date(apt.appointment_date), 'yyyy-MM') === currentMonth
      ) || [];

      const monthlyRevenue = monthlyAppointments.reduce((sum, apt) => sum + (apt.price || 0), 0);

      const statusCounts = appointmentsData?.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {} as any) || {};

      setStats({
        totalAppointments: appointmentsData?.length || 0,
        todayAppointments,
        monthlyRevenue,
        totalPets: pets.length,
        popularService: 'Banho e Tosa',
        appointmentsByStatus: {
          pending: statusCounts.pending || 0,
          confirmed: statusCounts.confirmed || 0,
          completed: statusCounts.completed || 0,
          cancelled: statusCounts.cancelled || 0
        }
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const getAgendaForDate = (date: Date) => {
    return appointments.filter(apt => 
      format(new Date(apt.appointment_date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Concluído';
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao Pet Care Center! Aqui está um resumo do seu dia.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Bell className="h-4 w-4 mr-2" />
              Notificações
              <Badge className="ml-2 bg-destructive">3</Badge>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Configurações</span>
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-primary"
              onClick={() => navigate('/appointments')}
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Novo </span>Agendamento
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://www.youtube.com.br', '_blank')}
              className="hover:bg-primary hover:text-primary-foreground hidden lg:flex"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pets</CardTitle>
              <PawPrint className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPets}</div>
              <p className="text-xs text-muted-foreground">
                +5 este mês
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agendamentos</CardTitle>
              <Users className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Desde o início
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Agenda Semanal */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Agenda da Semana</CardTitle>
                <CardDescription>
                  Próximos agendamentos por dia
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weekDays.map((date, index) => {
                  const dayAppointments = getAgendaForDate(date);
                  const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${isToday ? 'bg-primary/5 border-primary' : 'bg-card'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center space-x-2">
                          <span>
                            {format(date, 'EEE, dd/MM', { locale: ptBR })}
                          </span>
                          {isToday && <Badge variant="secondary">Hoje</Badge>}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {dayAppointments.length} agendamentos
                        </span>
                      </div>
                      
                      {dayAppointments.length > 0 ? (
                        <div className="space-y-2">
                          {dayAppointments.map((appointment) => {
                            const pet = pets.find(p => p.id === appointment.pet_id);
                            return (
                              <div 
                                key={appointment.id}
                                className="flex items-center justify-between p-3 bg-background rounded-md"
                              >
                                <div className="flex items-center space-x-3">
                                  {getStatusIcon(appointment.status)}
                                  <div>
                                    <div className="font-medium">{pet?.name || 'Pet'}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {appointment.start_time} - Serviço
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="outline">
                                  {getStatusLabel(appointment.status)}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Nenhum agendamento
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Status dos Agendamentos */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Status dos Agendamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm">Confirmados</span>
                  </div>
                  <Badge variant="secondary">{stats.appointmentsByStatus.confirmed}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <Badge variant="secondary">{stats.appointmentsByStatus.pending}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-info" />
                    <span className="text-sm">Concluídos</span>
                  </div>
                  <Badge variant="secondary">{stats.appointmentsByStatus.completed}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <span className="text-sm">Cancelados</span>
                  </div>
                  <Badge variant="secondary">{stats.appointmentsByStatus.cancelled}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Serviço Mais Popular */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Serviço Mais Popular</h4>
                  <p className="text-lg font-semibold text-primary">{stats.popularService}</p>
                  <p className="text-xs text-muted-foreground">45% dos agendamentos</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Horário de Pico</h4>
                  <p className="text-lg font-semibold text-secondary">14:00 - 16:00</p>
                  <p className="text-xs text-muted-foreground">Período mais movimentado</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/pets')}
                >
                  <PawPrint className="h-4 w-4 mr-2" />
                  Cadastrar Pet
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Ver Relatórios
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/customers')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Clientes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}