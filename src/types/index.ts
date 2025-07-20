// Types para o sistema Pet Schedule Hub

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'petshop_owner' | 'customer';
  createdAt: Date;
}

export interface PetShop {
  id: string;
  name: string;
  ownerId: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  plan: 'free' | 'basic' | 'professional' | 'master';
  monthlyAppointments: number;
  maxAppointments: number;
  createdAt: Date;
}

export interface Service {
  id: string;
  petShopId: string;
  name: string;
  description: string;
  prices: {
    small: number; // Para pets pequenos
    medium: number; // Para pets médios
    large: number; // Para pets grandes
  };
  duration: number; // Duração em minutos
  active: boolean;
  createdAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  weight: number;
  photo?: string;
  ownerId: string; // ID do tutor
  notes?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  petShopId: string;
  petId: string;
  serviceId: string;
  customerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  createdAt: Date;
}

export interface SaaSPlan {
  id: string;
  name: string;
  price: number;
  maxAppointments: number | 'unlimited';
  features: string[];
  popular?: boolean;
}

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  monthlyRevenue: number;
  totalPets: number;
  popularService: string;
  appointmentsByStatus: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}