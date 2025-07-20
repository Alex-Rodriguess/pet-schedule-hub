import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Petshop {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  plan: string;
  monthly_appointments: number;
  max_appointments: number;
  active: boolean;
}

export function usePetshop() {
  const [petshop, setPetshop] = useState<Petshop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPetshop();
  }, []);

  const loadPetshop = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile) {
        const { data: petshopData } = await supabase
          .from('petshops')
          .select('*')
          .eq('owner_id', profile.id)
          .single();

        setPetshop(petshopData);
      }
    } catch (error) {
      console.error('Erro ao carregar petshop:', error);
    } finally {
      setLoading(false);
    }
  };

  return { petshop, loading, refetch: loadPetshop };
}