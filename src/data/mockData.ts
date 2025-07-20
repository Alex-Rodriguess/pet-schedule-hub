import { SaaSPlan, Service, Pet, Appointment, PetShop, User, DashboardStats } from '@/types';

// Planos SaaS
export const saasPlans: SaaSPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    maxAppointments: 30,
    features: [
      '30 agendamentos por mês',
      'Cadastro básico de pets',
      'Agenda simples',
      'Suporte por email'
    ]
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 49,
    maxAppointments: 200,
    features: [
      '200 agendamentos por mês',
      'Gestão completa de pets',
      'Agenda avançada',
      'Relatórios básicos',
      'Suporte prioritário'
    ]
  },
  {
    id: 'professional',
    name: 'Profissional',
    price: 89,
    maxAppointments: 'unlimited',
    popular: true,
    features: [
      'Agendamentos ilimitados',
      'Notificações WhatsApp',
      'Relatórios avançados',
      'Personalização visual',
      'API de integração',
      'Suporte 24/7'
    ]
  },
  {
    id: 'master',
    name: 'Master',
    price: 149,
    maxAppointments: 'unlimited',
    features: [
      'Tudo do Profissional',
      'Sistema multiloja',
      'Programa de fidelidade',
      'Gateway de pagamento',
      'Dashboard analytics',
      'Consultoria especializada'
    ]
  }
];

// Serviços padrão para petshops
export const defaultServices: Omit<Service, 'id' | 'petShopId' | 'createdAt'>[] = [
  {
    name: 'Banho Simples',
    description: 'Banho com shampoo neutro, secagem e perfume',
    prices: { small: 25, medium: 35, large: 50 },
    duration: 60,
    active: true
  },
  {
    name: 'Banho e Tosa',
    description: 'Banho completo + tosa higiênica ou estética',
    prices: { small: 45, medium: 65, large: 85 },
    duration: 120,
    active: true
  },
  {
    name: 'Tosa Completa',
    description: 'Corte de pelos, unhas, limpeza de ouvidos',
    prices: { small: 35, medium: 50, large: 70 },
    duration: 90,
    active: true
  },
  {
    name: 'Consulta Veterinária',
    description: 'Consulta clínica geral com veterinário',
    prices: { small: 80, medium: 80, large: 80 },
    duration: 30,
    active: true
  },
  {
    name: 'Vacinação',
    description: 'Aplicação de vacinas (valor não inclui vacina)',
    prices: { small: 25, medium: 25, large: 25 },
    duration: 15,
    active: true
  }
];

// Mock de usuários
export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'João Silva',
    email: 'joao@petshop.com',
    phone: '(11) 99999-0001',
    role: 'petshop_owner',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'user2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 99999-0002',
    role: 'customer',
    createdAt: new Date('2024-02-10')
  }
];

// Mock de petshop
export const mockPetShop: PetShop = {
  id: 'petshop1',
  name: 'Pet Care Center',
  ownerId: 'user1',
  email: 'contato@petcare.com',
  phone: '(11) 3333-4444',
  address: 'Rua das Flores, 123 - São Paulo, SP',
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981'
  },
  plan: 'professional',
  monthlyAppointments: 45,
  maxAppointments: 'unlimited' as any,
  createdAt: new Date('2024-01-15')
};

// Mock de pets
export const mockPets: Pet[] = [
  {
    id: 'pet1',
    name: 'Rex',
    breed: 'Golden Retriever',
    age: 3,
    size: 'large',
    weight: 28,
    ownerId: 'user2',
    notes: 'Muito dócil, gosta de carinho',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'pet2',
    name: 'Luna',
    breed: 'Shih Tzu',
    age: 2,
    size: 'small',
    weight: 5,
    ownerId: 'user2',
    notes: 'Nervosa com ruídos altos',
    createdAt: new Date('2024-02-05')
  }
];

// Mock de agendamentos
export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    petShopId: 'petshop1',
    petId: 'pet1',
    serviceId: 'service1',
    customerId: 'user2',
    date: new Date('2024-12-20'),
    startTime: '09:00',
    endTime: '11:00',
    status: 'confirmed',
    price: 85,
    notes: 'Primeira vez do Rex aqui',
    createdAt: new Date('2024-12-18')
  },
  {
    id: 'apt2',
    petShopId: 'petshop1',
    petId: 'pet2',
    serviceId: 'service2',
    customerId: 'user2',
    date: new Date('2024-12-21'),
    startTime: '14:00',
    endTime: '15:00',
    status: 'pending',
    price: 45,
    createdAt: new Date('2024-12-19')
  }
];

// Mock de estatísticas do dashboard
export const mockDashboardStats: DashboardStats = {
  totalAppointments: 156,
  todayAppointments: 8,
  monthlyRevenue: 4250,
  totalPets: 89,
  popularService: 'Banho e Tosa',
  appointmentsByStatus: {
    pending: 12,
    confirmed: 25,
    completed: 98,
    cancelled: 21
  }
};