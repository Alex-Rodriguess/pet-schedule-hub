import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { mockAppointments, mockPets, mockPetShop } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientPortal() {
  const [activeTab, setActiveTab] = useState('appointments');
  
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
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-3">
                <PawPrint className="h-8 w-8" />
                <span>{mockPetShop.name}</span>
              </h1>
              <p className="opacity-90 mt-2">
                Portal do Cliente - Gerencie os agendamentos dos seus pets
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right text-sm">
                <div className="font-semibold">Maria Santos</div>
                <div className="opacity-80">maria@email.com</div>
              </div>
              <Button variant="secondary" size="sm">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'appointments' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('appointments')}
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendamentos
          </Button>
          <Button
            variant={activeTab === 'pets' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pets')}
            className="flex-1"
          >
            <PawPrint className="h-4 w-4 mr-2" />
            Meus Pets
          </Button>
          <Button
            variant={activeTab === 'schedule' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('schedule')}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agendar
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
                <Button className="bg-gradient-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {mockAppointments.map((appointment) => {
                const pet = mockPets.find(p => p.id === appointment.petId);
                return (
                  <Card key={appointment.id} className="shadow-soft">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center">
                            <PawPrint className="h-8 w-8 text-white" />
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg">{pet?.name}</h3>
                            <p className="text-muted-foreground">Banho e Tosa</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{format(appointment.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{appointment.startTime}</span>
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
              <Button className="bg-gradient-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Pet
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {mockPets.map((pet) => (
                <Card key={pet.id} className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
                        <PawPrint className="h-10 w-10 text-white" />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold">{pet.name}</h3>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>Raça: {pet.breed}</div>
                          <div>Idade: {pet.age} anos</div>
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
                    {mockPets.map((pet) => (
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
                <span>{mockPetShop.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{mockPetShop.email}</span>
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