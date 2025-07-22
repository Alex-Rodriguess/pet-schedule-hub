import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PricingCard } from '@/components/ui/pricing-card';
import { PawPrint, ArrowLeft, Store, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { saasPlans } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || 'free');
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setStep(2);
  };

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
            name: formData.ownerName,
            role: 'petshop_owner'
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
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
        // Aguardar criação do perfil pelo trigger
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Buscar o perfil criado
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', authData.user.id)
          .single();

        if (profileError || !profile) {
          console.error('Erro ao buscar perfil:', profileError);
          toast({
            title: "Erro",
            description: "Erro ao criar perfil do usuário.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        // Criar petshop
        const { data: petshopData, error: petshopError } = await supabase
          .from('petshops')
          .insert({
            name: formData.businessName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            owner_id: profile.id,
            plan: selectedPlan,
            primary_color: '#3B82F6',
            secondary_color: '#10B981'
          })
          .select()
          .single();

        if (petshopError) {
          console.error('Erro ao criar petshop:', petshopError);
          toast({
            title: "Erro",
            description: "Erro ao criar petshop: " + petshopError.message,
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vindo ao Pet Schedule Hub! Sua conta foi criada.",
        });
        
        navigate('/dashboard');
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

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>

          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <PawPrint className="h-10 w-10 text-primary" />
              <span className="text-3xl font-bold">Pet Schedule Hub</span>
            </div>
            <h1 className="text-4xl font-bold">Escolha seu plano</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Selecione o plano ideal para o seu petshop. Você pode mudar a qualquer momento.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {saasPlans.map((plan) => (
              <PricingCard 
                key={plan.id} 
                plan={plan} 
                onSelect={handlePlanSelect}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              ✓ Teste grátis por 14 dias • ✓ Cancele a qualquer momento • ✓ Suporte 24/7
            </p>
          </div>
        </div>
      </div>
    );
  }

  const selectedPlanData = saasPlans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Plan Summary */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-hero text-primary-foreground p-8 items-center">
        <div className="max-w-md space-y-6">
          <div className="flex items-center space-x-3">
            <PawPrint className="h-8 w-8" />
            <span className="text-2xl font-bold">Pet Schedule Hub</span>
          </div>
          
          <h2 className="text-3xl font-bold">
            Você escolheu o plano {selectedPlanData?.name}
          </h2>
          
          <div className="space-y-4 text-sm opacity-90">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-3xl font-bold mb-2">
                R$ {selectedPlanData?.price || 0}
                {selectedPlanData?.price ? '/mês' : ''}
              </div>
              <div className="space-y-2">
                {selectedPlanData?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => setStep(1)}
            className="text-white hover:bg-white/10"
          >
            ← Voltar aos planos
          </Button>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 lg:flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Criar Conta</h2>
            <p className="text-muted-foreground">
              Plano {selectedPlanData?.name} - R$ {selectedPlanData?.price || 0}
              {selectedPlanData?.price ? '/mês' : ''}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Dados do Petshop</CardTitle>
              <CardDescription>
                Preencha as informações do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nome do Petshop</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="business-name"
                      type="text"
                      placeholder="Pet Care Center"
                      className="pl-10"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner-name">Nome do Proprietário</Label>
                  <Input
                    id="owner-name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="contato@petshop.com"
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
                  <Label htmlFor="address">Endereço Completo</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Rua das Flores, 123 - São Paulo, SP"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
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
                  className="w-full bg-gradient-primary" 
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Criando conta..." : `Criar Conta - ${selectedPlanData?.name}`}
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