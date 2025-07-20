import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PricingCard } from '@/components/ui/pricing-card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  Heart, 
  Smartphone, 
  BarChart3, 
  Shield,
  PawPrint,
  Clock,
  Star
} from 'lucide-react';
import { saasPlans } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-petshop.jpg';

export default function LandingPage() {
  const navigate = useNavigate();

  const handlePlanSelect = (planId: string) => {
    navigate(`/register?plan=${planId}`);
  };

  const features = [
    {
      icon: Calendar,
      title: 'Agenda Inteligente',
      description: 'Sistema de agendamentos com controle de horários e prevenção de conflitos'
    },
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Cadastro completo de tutores e seus pets com histórico detalhado'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Interface responsiva otimizada para celulares e tablets'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Avançados',
      description: 'Analytics completos com faturamento e pets mais frequentes'
    },
    {
      icon: Heart,
      title: 'Notificações WhatsApp',
      description: 'Lembretes automáticos para clientes via WhatsApp'
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Dados protegidos com backup automático na nuvem'
    }
  ];

  const testimonials = [
    {
      name: 'Ana Paula',
      business: 'Pet Mimo',
      text: 'Aumentei 40% os agendamentos após usar o Pet Schedule Hub. A organização ficou muito melhor!',
      rating: 5
    },
    {
      name: 'Carlos Santos',
      business: 'Clínica Veterinária São João',
      text: 'O sistema de notificações reduziu drasticamente as faltas. Recomendo para todos os colegas.',
      rating: 5
    },
    {
      name: 'Marina Costa',
      business: 'Banho & Tosa Feliz',
      text: 'Interface super intuitiva. Meus clientes conseguem agendar sozinhos pelo celular.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Pet Schedule Hub</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/register')}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-white/20 text-white border-white/30">
              Mais de 1.000 petshops confiam em nós
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Gerencie seu
              <span className="text-accent"> petshop </span>
              com inteligência
            </h1>
            
            <p className="text-xl opacity-90 leading-relaxed">
              Sistema completo para agendamentos, gestão de clientes e pets.
              Aumente sua produtividade e a satisfação dos seus clientes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-medium"
                onClick={() => navigate('/register')}
              >
                Começar Gratuitamente
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
              >
                Ver Demonstração
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Setup em 5 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>100% Seguro</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={heroImage} 
              alt="Pet sendo cuidado em petshop moderno"
              className="rounded-2xl shadow-strong w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-medium">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">+150 agendamentos</div>
                  <div className="text-sm text-muted-foreground">este mês</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Tudo que você precisa para crescer</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas profissionais para modernizar seu petshop e encantar seus clientes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-soft hover:shadow-medium transition-all scale-hover">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">O que nossos clientes dizem</h2>
            <p className="text-xl text-muted-foreground">
              Histórias reais de petshops que transformaram seus negócios
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="p-8 space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Planos que crescem com você</h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para o seu petshop. Comece grátis!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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
              Todos os planos incluem suporte técnico e atualizações gratuitas
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">
            Pronto para revolucionar seu petshop?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de petshops que já modernizaram sua gestão. 
            Comece hoje mesmo, é grátis!
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 shadow-medium"
            onClick={() => navigate('/register')}
          >
            Começar Agora - É Grátis!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Pet Schedule Hub</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary">Termos de Uso</a>
              <a href="#" className="hover:text-primary">Privacidade</a>
              <a href="#" className="hover:text-primary">Suporte</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 Pet Schedule Hub. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}