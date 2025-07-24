import React from 'react';
import { useLocation } from 'react-router-dom';
import ClientAppointments from './client/ClientAppointments';

export default function ClientPortal() {
  const location = useLocation();
  
  // Determina qual conteúdo mostrar baseado na rota
  const renderContent = () => {
    const path = location.pathname;
    
    if (path === '/client/appointments' || path === '/client-portal') {
      return <ClientAppointments />;
    }
    
    if (path === '/client/pets') {
      return <div className="container mx-auto p-6"><h1 className="text-3xl font-bold">Meus Pets</h1></div>;
    }
    
    if (path === '/client/schedule') {
      return <div className="container mx-auto p-6"><h1 className="text-3xl font-bold">Agendar Serviços</h1></div>;
    }
    
    if (path === '/client/profile') {
      return <div className="container mx-auto p-6"><h1 className="text-3xl font-bold">Meu Perfil</h1></div>;
    }
    
    return <ClientAppointments />;
  };

  return renderContent();
}