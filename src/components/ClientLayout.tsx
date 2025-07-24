import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  PawPrint,
  User,
  Calendar,
  Plus,
  LogOut,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthWithRole } from '@/hooks/useAuthWithRole';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuthWithRole();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { path: '/client/appointments', label: 'Agendamentos', icon: Calendar },
    { path: '/client/pets', label: 'Meus Pets', icon: PawPrint },
    { path: '/client/schedule', label: 'Agendar', icon: Plus },
    { path: '/client/profile', label: 'Perfil', icon: User },
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
              <span className="text-xl font-bold">Portal Cliente</span>
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
            <div className="text-sm text-muted-foreground mb-4">
              <div className="font-medium">{user?.email}</div>
            </div>
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
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  {user?.email || 'Cliente'}
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