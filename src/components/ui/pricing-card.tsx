import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { SaaSPlan } from '@/types';

interface PricingCardProps {
  plan: SaaSPlan;
  onSelect: (planId: string) => void;
  className?: string;
}

export function PricingCard({ plan, onSelect, className }: PricingCardProps) {
  return (
    <Card className={`relative ${plan.popular ? 'border-primary shadow-medium scale-105' : ''} ${className || ''}`}>
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary">
          Mais Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold">R$ {plan.price}</span>
          {plan.price > 0 && <span className="text-muted-foreground">/mês</span>}
        </div>
        <CardDescription className="mt-2">
          {typeof plan.maxAppointments === 'number' 
            ? `${plan.maxAppointments} agendamentos/mês`
            : 'Agendamentos ilimitados'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          onClick={() => onSelect(plan.id)}
          className={plan.popular ? 'bg-gradient-primary hover:opacity-90' : ''}
          size="lg"
          variant={plan.popular ? 'default' : 'outline'}
        >
          {plan.price === 0 ? 'Começar Grátis' : 'Assinar Plano'}
        </Button>
      </CardContent>
    </Card>
  );
}