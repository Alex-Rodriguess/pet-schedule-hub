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
  Search,
  User,
  Phone,
  Mail,
  Edit,
  Heart
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { usePetshop } from '@/hooks/usePetshop';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPetDialog, setShowPetDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const { user } = useAuth();
  const { petshop } = usePetshop();
  const { toast } = useToast();
  
  // Pet form data
  const [petForm, setPetForm] = useState({
    name: '',
    breed: '',
    age: '',
    size: 'medium',
    weight: '',
    notes: ''
  });
  
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

  const handleSavePet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !petshop?.id) return;

    try {
      // First, get or create customer
      let { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .eq('petshop_id', petshop.id)
        .single();

      if (customerError && customerError.code !== 'PGRST116') {
        throw customerError;
      }

      if (!customer) {
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            name: user.email,
            email: user.email,
            phone: '',
            petshop_id: petshop.id
          })
          .select()
          .single();

        if (createError) throw createError;
        customer = newCustomer;
      }

      const { error } = await supabase
        .from('pets')
        .insert({
          name: petForm.name,
          breed: petForm.breed,
          age: parseInt(petForm.age) || 0,
          size: petForm.size,
          weight: petForm.weight ? parseFloat(petForm.weight) : null,
          notes: petForm.notes || null,
          customer_id: customer.id
        });

      if (error) throw error;

      setPetForm({
        name: '',
        breed: '',
        age: '',
        size: 'medium',
        weight: '',
        notes: ''
      });
      setShowPetDialog(false);
      loadPets();
      
      toast({
        title: "Pet cadastrado",
        description: "Pet cadastrado com sucesso!",
      });
    } catch (error) {
      console.error('Error saving pet:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar pet. Tente novamente.",
        variant: "destructive"
      });
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
          end_time: appointmentForm.start_time, // You might want to calculate this
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center space-x-3">
                <PawPrint className="h-6 w-6 sm:h-8 sm:w-8" />
                <span>{petshop?.name || 'Pet Shop'}</span>
              </h1>
              <p className="opacity-90 mt-2 text-sm sm:text-base">
                Portal do Cliente - Gerencie os agendamentos dos seus pets
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm hidden sm:block">
                <div className="font-semibold">{user?.email || 'Cliente'}</div>
                <div className="opacity-80">{user?.email}</div>
              </div>
              <Button variant="secondary" size="sm">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Perfil</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg overflow-x-auto">
          <Button
            variant={activeTab === 'appointments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('appointments')}
            className="flex-1 min-w-fit"
          >
            <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Agendamentos</span>
          </Button>
          <Button
            variant={activeTab === 'pets' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pets')}
            className="flex-1 min-w-fit"
          >
            <PawPrint className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Meus Pets</span>
          </Button>
          <Button
            variant={activeTab === 'schedule' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('schedule')}
            className="flex-1 min-w-fit"
          >
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Agendar</span>
          </Button>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <h2 className="text-2xl font-bold">Meus Agendamentos</h2>
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
                  <DialogContent className="max-w-md mx-4 sm:mx-auto">
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
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancelar
                              </Button>
                            )}
                            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Reagendar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Pets Tab */}
        {activeTab === 'pets' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <h2 className="text-2xl font-bold">Meus Pets</h2>
                <Dialog open={showPetDialog} onOpenChange={setShowPetDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-secondary">
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Pet
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Pet</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do seu pet
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSavePet} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nome *</Label>
                          <Input
                            id="name"
                            value={petForm.name}
                            onChange={(e) => setPetForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nome do pet"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="breed">Raça *</Label>
                          <Input
                            id="breed"
                            value={petForm.breed}
                            onChange={(e) => setPetForm(prev => ({ ...prev, breed: e.target.value }))}
                            placeholder="Raça do pet"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                           <Label htmlFor="age">Idade (meses)</Label>
                          <Input
                            id="age"
                            type="number"
                            min="0"
                            max="360"
                            value={petForm.age}
                            onChange={(e) => setPetForm(prev => ({ ...prev, age: e.target.value }))}
                            placeholder="0"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="size">Porte</Label>
                          <Select value={petForm.size} onValueChange={(value) => setPetForm(prev => ({ ...prev, size: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Pequeno</SelectItem>
                              <SelectItem value="medium">Médio</SelectItem>
                              <SelectItem value="large">Grande</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="weight">Peso (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={petForm.weight}
                            onChange={(e) => setPetForm(prev => ({ ...prev, weight: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">Observações</Label>
                        <Textarea
                          id="notes"
                          value={petForm.notes}
                          onChange={(e) => setPetForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Observações importantes sobre o pet..."
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setShowPetDialog(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit">
                          Cadastrar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto sm:mx-0">
                        <PawPrint className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                      </div>
                      
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold">{pet.name}</h3>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>Raça: {pet.breed}</div>
                            <div>Idade: {pet.age} meses</div>
                            <div>Porte: {pet.size === 'small' ? 'Pequeno' : pet.size === 'medium' ? 'Médio' : 'Grande'}</div>
                            <div>Peso: {pet.weight}kg</div>
                          </div>
                        
                        {pet.notes && (
                          <div className="mt-3 p-3 bg-muted rounded-lg">
                            <div className="text-sm font-medium mb-1">Observações:</div>
                            <div className="text-sm text-muted-foreground">{pet.notes}</div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                          <div className="text-sm text-muted-foreground">
                            Últimos agendamentos: 3
                          </div>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4 mr-1" />
                            Agendar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Novo Agendamento</h2>
            
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Agendar Serviço</CardTitle>
                <CardDescription>
                  Escolha o pet, serviço e horário desejado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">1. Escolha o Pet</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {pets.map((pet) => (
                      <Card key={pet.id} className="cursor-pointer hover:shadow-medium transition-shadow border-2 hover:border-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                              <PawPrint className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold">{pet.name}</div>
                              <div className="text-sm text-muted-foreground">{pet.breed}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">2. Escolha o Serviço</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:shadow-medium transition-shadow border-2 hover:border-primary">
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-semibold">Banho Simples</div>
                        <div className="text-sm text-muted-foreground mb-2">60 minutos</div>
                        <div className="text-xl font-bold text-primary">R$ 35</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:shadow-medium transition-shadow border-2 hover:border-primary">
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-semibold">Banho e Tosa</div>
                        <div className="text-sm text-muted-foreground mb-2">120 minutos</div>
                        <div className="text-xl font-bold text-primary">R$ 65</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">3. Escolha Data e Horário</h3>
                  <div className="bg-muted/30 p-6 rounded-lg text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Calendário de agendamento será exibido aqui
                    </p>
                    <Button className="mt-4 bg-gradient-primary">
                      Selecionar Data e Horário
                    </Button>
                  </div>
                </div>

                <Button size="lg" className="w-full bg-gradient-secondary">
                  Confirmar Agendamento
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Contact Info */}
        <Card className="shadow-soft bg-gradient-hero text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Contato do Petshop</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{petshop?.phone || '(11) 99999-9999'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{petshop?.email || 'contato@petshop.com'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PawPrint className="h-4 w-4" />
                <span>Segunda a Sábado: 8h às 18h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}