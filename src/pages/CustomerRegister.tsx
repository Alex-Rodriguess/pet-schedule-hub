import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PawPrint, ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar senhas
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Erro", 
          description: "A senha deve ter pelo menos 6 caracteres.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Criar usuário no Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: 'customer'
          },
          emailRedirectTo: `${window.location.origin}/client-portal`
        }
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);
        toast({
          title: "Erro no cadastro",
          description: authError.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Sua conta foi criada. Faça login para continuar.",
        });
        
        navigate('/login');
      }
    } catch (error) {
      console.error('Erro geral:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o cadastro.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-hero text-primary-foreground p-8 items-center">
        <div className="max-w-md space-y-6">
          <div className="flex items-center space-x-3">
            <PawPrint className="h-8 w-8" />
            <span className="text-2xl font-bold">Pet Schedule Hub</span>
          </div>
          
          <h2 className="text-3xl font-bold">
            Bem-vindo ao nosso sistema!
          </h2>
          
          <p className="text-lg opacity-90">
            Crie sua conta para agendar serviços para seu pet de forma simples e rápida.
          </p>
          
          <div className="space-y-4 text-sm opacity-90">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Agendamentos online 24/7</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Histórico completo do seu pet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  <span>Notificações automáticas</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            ← Voltar ao início
          </Button>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 lg:flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Pet Schedule Hub</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>
            <p className="text-muted-foreground">
              Cadastre-se para agendar serviços
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Dados do Cliente</CardTitle>
              <CardDescription>
                Preencha suas informações para criar a conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Seu endereço"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>
              
              <div className="mt-6 text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto"
                    onClick={() => navigate('/login')}
                  >
                    Fazer login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}