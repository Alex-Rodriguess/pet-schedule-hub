-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('petshop_owner', 'customer', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de petshops
CREATE TABLE public.petshops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#10B981',
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'professional', 'master')),
  monthly_appointments INTEGER DEFAULT 0,
  max_appointments INTEGER DEFAULT 30,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  petshop_id UUID NOT NULL REFERENCES public.petshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pets
CREATE TABLE public.pets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INTEGER NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  weight DECIMAL(5,2),
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de serviços
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  petshop_id UUID NOT NULL REFERENCES public.petshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_small DECIMAL(10,2) NOT NULL,
  price_medium DECIMAL(10,2) NOT NULL,
  price_large DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- em minutos
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  petshop_id UUID NOT NULL REFERENCES public.petshops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  barcode TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  category TEXT,
  brand TEXT,
  unit TEXT DEFAULT 'un',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de vendas
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  petshop_id UUID NOT NULL REFERENCES public.petshops(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id),
  employee_id UUID REFERENCES public.profiles(id),
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'pix', 'multiple')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens de venda
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  petshop_id UUID NOT NULL REFERENCES public.petshops(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  price DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.petshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Criar função para obter perfil do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS public.profiles AS $$
  SELECT * FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Criar função para obter petshop do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_petshop()
RETURNS public.petshops AS $$
  SELECT p.* FROM public.petshops p
  INNER JOIN public.profiles pr ON p.owner_id = pr.id
  WHERE pr.user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Políticas para petshops
CREATE POLICY "Petshop owners can manage their petshop" ON public.petshops
  FOR ALL USING (
    owner_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  );

-- Políticas para clientes
CREATE POLICY "Petshop owners can manage customers" ON public.customers
  FOR ALL USING (
    petshop_id IN (
      SELECT p.id FROM public.petshops p
      INNER JOIN public.profiles pr ON p.owner_id = pr.id
      WHERE pr.user_id = auth.uid()
    )
  );

-- Políticas para pets
CREATE POLICY "Petshop owners can manage pets" ON public.pets
  FOR ALL USING (
    customer_id IN (
      SELECT c.id FROM public.customers c
      INNER JOIN public.petshops p ON c.petshop_id = p.id
      INNER JOIN public.profiles pr ON p.owner_id = pr.id
      WHERE pr.user_id = auth.uid()
    )
  );

-- Políticas para serviços
CREATE POLICY "Petshop owners can manage services" ON public.services
  FOR ALL USING (
    petshop_id IN (
      SELECT p.id FROM public.petshops p
      INNER JOIN public.profiles pr ON p.owner_id = pr.id
      WHERE pr.user_id = auth.uid()
    )
  );

-- Políticas para produtos
CREATE POLICY "Petshop owners can manage products" ON public.products
  FOR ALL USING (
    petshop_id IN (
      SELECT p.id FROM public.petshops p
      INNER JOIN public.profiles pr ON p.owner_id = pr.id
      WHERE pr.user_id = auth.uid()
    )
  );

-- Políticas para vendas
CREATE POLICY "Petshop owners can manage sales" ON public.sales
  FOR ALL USING (
    petshop_id IN (
      SELECT p.id FROM public.petshops p
      INNER JOIN public.profiles pr ON p.owner_id = pr.id
      WHERE pr.user_id = auth.uid()
    )
  );

-- Políticas para itens de venda
CREATE POLICY "Petshop owners can manage sale items" ON public.sale_items
  FOR ALL USING (
    sale_id IN (
      SELECT s.id FROM public.sales s
      INNER JOIN public.petshops p ON s.petshop_id = p.id
      INNER JOIN public.profiles pr ON p.owner_id = pr.id
      WHERE pr.user_id = auth.uid()
    )
  );

-- Políticas para agendamentos
CREATE POLICY "Petshop owners can manage appointments" ON public.appointments
  FOR ALL USING (
    petshop_id IN (
      SELECT p.id FROM public.petshops p
      INNER JOIN public.profiles pr ON p.owner_id = pr.id
      WHERE pr.user_id = auth.uid()
    )
  );

-- Criar função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para atualizar timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_petshops_updated_at
  BEFORE UPDATE ON public.petshops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Criar índices para performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_petshops_owner_id ON public.petshops(owner_id);
CREATE INDEX idx_customers_petshop_id ON public.customers(petshop_id);
CREATE INDEX idx_pets_customer_id ON public.pets(customer_id);
CREATE INDEX idx_services_petshop_id ON public.services(petshop_id);
CREATE INDEX idx_products_petshop_id ON public.products(petshop_id);
CREATE INDEX idx_products_barcode ON public.products(barcode);
CREATE INDEX idx_sales_petshop_id ON public.sales(petshop_id);
CREATE INDEX idx_sales_created_at ON public.sales(created_at);
CREATE INDEX idx_sale_items_sale_id ON public.sale_items(sale_id);
CREATE INDEX idx_appointments_petshop_id ON public.appointments(petshop_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);

-- Função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();