import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Save,
  Settings as SettingsIcon,
  Bell,
  Palette,
  Shield,
  User,
  Building,
  Phone,
  Mail
} from 'lucide-react';
import Layout from '@/components/Layout';
import { usePetshop } from '@/hooks/usePetshop';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function Settings() {
  const { petshop, refetch } = usePetshop();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Petshop settings
  const [petshopData, setPetshopData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    primary_color: '#3B82F6',
    secondary_color: '#10B981'
  });

  // App settings
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);

  useEffect(() => {
    if (petshop) {
      setPetshopData({
        name: petshop.name || '',
        email: petshop.email || '',
        phone: petshop.phone || '',
        address: petshop.address || '',
        primary_color: petshop.primary_color || '#3B82F6',
        secondary_color: petshop.secondary_color || '#10B981'
      });
    }
  }, [petshop]);

  const handleSavePetshop = async () => {
    if (!petshop?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('petshops')
        .update(petshopData)
        .eq('id', petshop.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Configurações salvas",
        description: "As informações do pet shop foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating petshop:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do seu pet shop e da aplicação
          </p>
        </div>

        <div className="grid gap-6">
          {/* Informações do Pet Shop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Informações do Pet Shop</span>
              </CardTitle>
              <CardDescription>
                Configure as informações básicas do seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Pet Shop</Label>
                  <Input
                    id="name"
                    value={petshopData.name}
                    onChange={(e) => setPetshopData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do seu pet shop"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={petshopData.email}
                      onChange={(e) => setPetshopData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contato@petshop.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={petshopData.phone}
                      onChange={(e) => setPetshopData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 9999-9999"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={petshopData.address}
                    onChange={(e) => setPetshopData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Endereço completo"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>Personalização</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary_color">Cor Primária</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={petshopData.primary_color}
                        onChange={(e) => setPetshopData(prev => ({ ...prev, primary_color: e.target.value }))}
                        className="w-20 h-10 p-1 rounded"
                      />
                      <Input
                        value={petshopData.primary_color}
                        onChange={(e) => setPetshopData(prev => ({ ...prev, primary_color: e.target.value }))}
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary_color">Cor Secundária</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={petshopData.secondary_color}
                        onChange={(e) => setPetshopData(prev => ({ ...prev, secondary_color: e.target.value }))}
                        className="w-20 h-10 p-1 rounded"
                      />
                      <Input
                        value={petshopData.secondary_color}
                        onChange={(e) => setPetshopData(prev => ({ ...prev, secondary_color: e.target.value }))}
                        placeholder="#10B981"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePetshop} disabled={loading} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Informações'}
              </Button>
            </CardContent>
          </Card>

          {/* Configurações de Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificações</span>
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações no navegador sobre novos agendamentos
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber e-mails sobre agendamentos e lembretes
                  </p>
                </div>
                <Switch
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Confirmação Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Confirmar automaticamente novos agendamentos
                  </p>
                </div>
                <Switch
                  checked={autoConfirm}
                  onCheckedChange={setAutoConfirm}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações da Conta</span>
              </CardTitle>
              <CardDescription>
                Informações do usuário logado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID do Usuário</Label>
                  <Input
                    value={user?.id || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Segurança</span>
              </CardTitle>
              <CardDescription>
                Configurações de segurança e privacidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full md:w-auto">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}