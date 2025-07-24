import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Package, 
  PawPrint, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X,
  Calendar,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { usePetshop } from '@/hooks/usePetshop';
import { useAuthWithRole } from '@/hooks/useAuthWithRole';

interface PetshopLayoutProps {
  children: React.ReactNode;
}

export default function PetshopLayout({ children }: PetshopLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { petshop, loading } = usePetshop();
  const { signOut } = useAuthWithRole();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { path: '/petshop/dashboard', label: 'Dashboard', icon: Home },
    { path: '/petshop/customers', label: 'Clientes', icon: Users },
    { path: '/petshop/pets', label: 'Pets', icon: PawPrint },
    { path: '/petshop/products', label: 'Produtos', icon: Package },
    { path: '/petshop/services', label: 'Serviços', icon: Settings },
    { path: '/petshop/appointments', label: 'Agendamentos', icon: Calendar },
    { path: '/petshop/pdv', label: 'PDV', icon: ShoppingCart },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Pet Schedule</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t space-y-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/petshop/settings')}
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-3" />
              Configurações
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-destructive"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-3 ml-auto">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge className="ml-1 bg-destructive text-destructive-foreground">3</Badge>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {petshop?.name?.substring(0, 2).toUpperCase() || 'PS'}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {loading ? 'Carregando...' : (petshop?.name || 'Pet Shop')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}