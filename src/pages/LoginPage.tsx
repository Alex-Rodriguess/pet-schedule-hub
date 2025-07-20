import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PawPrint, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent, userType: 'petshop' | 'customer') => {
    e.preventDefault();
    setIsLoading(true);

    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) ao sistema.`,
      });
      
      if (userType === 'petshop') {
        navigate('/dashboard');
      } else {
        navigate('/client-portal');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="lg:flex-1 bg-gradient-hero flex items-center justify-center p-8 text-primary-foreground">
        <div className="max-w-md text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <PawPrint className="h-12 w-12" />
            <span className="text-3xl font-bold">Pet Schedule Hub</span>
          </div>
          
          <h1 className="text-4xl font-bold leading-tight">
            Bem-vindo de volta!
          </h1>
          
          <p className="text-xl opacity-90">
            Acesse sua conta e continue gerenciando seus agendamentos com facilidade.
          </p>
          
          <div className="space-y-4 text-sm opacity-80">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Acesso rápido e seguro</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Seus dados sempre protegidos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Forms */}
      <div className="lg:flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>

          <Tabs defaultValue="petshop" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="petshop">Petshop</TabsTrigger>
              <TabsTrigger value="customer">Cliente</TabsTrigger>
            </TabsList>

            {/* Login Petshop */}
            <TabsContent value="petshop">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Acesso do Petshop</CardTitle>
                  <CardDescription>
                    Entre com seus dados para acessar o painel administrativo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleLogin(e, 'petshop')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="petshop-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="petshop-email"
                          type="email"
                          placeholder="seu@petshop.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="petshop-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="petshop-password"
                          type="password"
                          placeholder="Sua senha"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-primary" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar no Painel"}
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center space-y-2">
                    <a href="#" className="text-sm text-primary hover:underline">
                      Esqueceu sua senha?
                    </a>
                    <div className="text-sm text-muted-foreground">
                      Não tem conta?{' '}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => navigate('/register')}
                      >
                        Cadastre seu petshop
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login Cliente */}
            <TabsContent value="customer">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Acesso do Cliente</CardTitle>
                  <CardDescription>
                    Entre para gerenciar os agendamentos dos seus pets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleLogin(e, 'customer')} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customer-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customer-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customer-password"
                          type="password"
                          placeholder="Sua senha"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-secondary" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center space-y-2">
                    <a href="#" className="text-sm text-primary hover:underline">
                      Esqueceu sua senha?
                    </a>
                    <div className="text-sm text-muted-foreground">
                      Primeira vez aqui?{' '}
                      <Button 
                        variant="link" 
                        className="p-0 h-auto"
                        onClick={() => navigate('/customer-register')}
                      >
                        Criar conta
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Demo Access */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <h3 className="font-semibold">Acesso de Demonstração</h3>
                <p className="text-sm text-muted-foreground">
                  Experimente o sistema sem criar uma conta
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/dashboard')}
                    className="flex-1"
                  >
                    Demo Petshop
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/client-portal')}
                    className="flex-1"
                  >
                    Demo Cliente
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