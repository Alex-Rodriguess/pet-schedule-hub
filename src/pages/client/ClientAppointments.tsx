import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  PawPrint,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthWithRole } from '@/hooks/useAuthWithRole';

export default function ClientAppointments() {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const { user } = useAuthWithRole();
  const { toast } = useToast();
  
  // Appointment form data
  const [appointmentForm, setAppointmentForm] = useState({
    pet_id: '',
    service_id: '',
    appointment_date: '',
    start_time: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPets(),
        loadAppointments(),
        loadServices()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('customers.email', user.email);

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const loadAppointments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          pet:pets(*),
          service:services(*),
          customer:customers(*)
        `)
        .eq('customers.email', user.email)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const selectedService = services.find(s => s.id === appointmentForm.service_id);
      const selectedPet = pets.find(p => p.id === appointmentForm.pet_id);
      
      if (!selectedService || !selectedPet) return;

      const price = selectedPet.size === 'small' ? selectedService.price_small :
                   selectedPet.size === 'medium' ? selectedService.price_medium :
                   selectedService.price_large;

      const { error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentForm,
          price,
          end_time: appointmentForm.start_time,
          status: 'pending',
          customer_id: selectedPet.customer_id,
          petshop_id: selectedPet.customer.petshop_id
        });

      if (error) throw error;

      setAppointmentForm({
        pet_id: '',
        service_id: '',
        appointment_date: '',
        start_time: '',
        notes: ''
      });
      setShowAppointmentDialog(false);
      loadAppointments();
      
      toast({
        title: "Agendamento criado",
        description: "Agendamento criado com sucesso!",
      });
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'destructive';
      case 'completed': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">Meus Agendamentos</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar agendamentos..." className="pl-10 w-64" />
          </div>
          <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>
                  Agende um serviço para seu pet
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveAppointment} className="space-y-4">
                <div>
                  <Label htmlFor="pet">Pet</Label>
                  <Select value={appointmentForm.pet_id} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, pet_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o pet" />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.name} - {pet.breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="service">Serviço</Label>
                  <Select value={appointmentForm.service_id} onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, service_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - R$ {service.price_small}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={appointmentForm.appointment_date}
                      onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointment_date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={appointmentForm.start_time}
                      onChange={(e) => setAppointmentForm(prev => ({ ...prev, start_time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observações especiais..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAppointmentDialog(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Agendar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {appointments.map((appointment) => {
          return (
            <Card key={appointment.id} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center">
                      <PawPrint className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{appointment.pet?.name}</h3>
                      <p className="text-muted-foreground">{appointment.service?.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.start_time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusIcon(appointment.status)}
                        <Badge variant={getStatusColor(appointment.status) as any}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="text-2xl font-bold text-primary">
                      R$ {appointment.price}
                    </div>
                    <div className="flex space-x-2">
                      {appointment.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          Reagendar
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}