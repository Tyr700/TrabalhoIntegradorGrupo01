import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Cadastro from "./pages/Cadastro";
import Vagas from "./pages/Vagas";
import Historico from "./pages/Historico";
import Remover from "./pages/Remover";
import Maquete from "./pages/Maquete";
import NotFound from "./pages/NotFound";
import Suporte from "./pages/Suporte";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/remover" element={<Remover />} />
          <Route path="/maquete" element={<Maquete />} />
          <Route path="/suporte" element={<Suporte />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
