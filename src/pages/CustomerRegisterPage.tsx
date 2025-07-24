import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PawPrint, ArrowLeft, User, Mail, Lock, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function CustomerRegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Bem-vindo! Sua conta foi criada.",
      });
      
      navigate('/client-portal');
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
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="lg:flex-1 bg-gradient-secondary flex items-center justify-center p-8 text-primary-foreground">
        <div className="max-w-md text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <PawPrint className="h-12 w-12" />
            <span className="text-3xl font-bold">Pet Schedule Hub</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight">
            Cadastre-se como Cliente
          </h1>
          
          <p className="text-xl opacity-90">
            Crie sua conta e comece a agendar serviços para seus pets de forma simples e rápida.
          </p>
          
          <div className="space-y-4 text-sm opacity-80">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Agendamento online</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Histórico de serviços</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Notificações automáticas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="lg:flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao login
          </Button>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Criar Conta de Cliente</CardTitle>
              <CardDescription>
                Preencha seus dados para criar sua conta
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
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirme sua senha"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-secondary" 
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
                <div className="text-xs text-muted-foreground">
                  Ao criar sua conta, você concorda com nossos{' '}
                  <a href="#" className="text-primary hover:underline">Termos de Uso</a>{' '}
                  e{' '}
                  <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}