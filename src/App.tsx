import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerRegisterPage from "./pages/CustomerRegisterPage";
import NotFound from "./pages/NotFound";

// Petshop Pages
import PetshopLayout from "./components/PetshopLayout";
import Dashboard from "./pages/Dashboard";
import PDV from "./pages/PDV";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Pets from "./pages/Pets";
import Appointments from "./pages/Appointments";
import Services from "./pages/Services";
import Settings from "./pages/Settings";

// Client Pages
import ClientLayout from "./components/ClientLayout";
import ClientPortal from "./pages/ClientPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/customer-register-standalone" element={<CustomerRegisterPage />} />
            
            {/* Petshop Routes */}
            <Route path="/petshop/dashboard" element={<PetshopLayout><Dashboard /></PetshopLayout>} />
            <Route path="/petshop/pdv" element={<PetshopLayout><PDV /></PetshopLayout>} />
            <Route path="/petshop/customers" element={<PetshopLayout><Customers /></PetshopLayout>} />
            <Route path="/petshop/products" element={<PetshopLayout><Products /></PetshopLayout>} />
            <Route path="/petshop/pets" element={<PetshopLayout><Pets /></PetshopLayout>} />
            <Route path="/petshop/appointments" element={<PetshopLayout><Appointments /></PetshopLayout>} />
            <Route path="/petshop/services" element={<PetshopLayout><Services /></PetshopLayout>} />
            <Route path="/petshop/settings" element={<PetshopLayout><Settings /></PetshopLayout>} />
            
            {/* Client Routes */}
            <Route path="/client/appointments" element={<ClientLayout><ClientPortal /></ClientLayout>} />
            <Route path="/client/pets" element={<ClientLayout><ClientPortal /></ClientLayout>} />
            <Route path="/client/schedule" element={<ClientLayout><ClientPortal /></ClientLayout>} />
            <Route path="/client/profile" element={<ClientLayout><ClientPortal /></ClientLayout>} />
            
            {/* Legacy Routes (redirect to new structure) */}
            <Route path="/dashboard" element={<PetshopLayout><Dashboard /></PetshopLayout>} />
            <Route path="/client-portal" element={<ClientLayout><ClientPortal /></ClientLayout>} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
