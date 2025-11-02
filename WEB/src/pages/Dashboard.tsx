import { Link } from "react-router-dom";
import {
  Car,
  History,
  XCircle,
  MapPin,
  UserPlus,
  PhoneCall,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const menuItems = [
    {
      title: "Cadastro de Veículos",
      description: "Registre veículos e motoristas",
      icon: UserPlus,
      path: "/cadastro",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Carros nas Vagas",
      description: "Visualize veículos estacionados",
      icon: Car,
      path: "/vagas",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Histórico",
      description: "Consulte o histórico completo",
      icon: History,
      path: "/historico",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Remover Carros",
      description: "Registre a saída de veículos",
      icon: XCircle,
      path: "/remover",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Maquete em Tempo Real",
      description: "Visualize o estacionamento ao vivo",
      icon: MapPin,
      path: "/maquete",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Suporte ao Usuário",
      description: "Entre em contato se tiver alguma dúvida ou problema",
      icon: PhoneCall,
      path: "/suporte",
      color: "from-red-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sistema de Estacionamento
          </h1>
          <p className="text-xl text-muted-foreground">
            Gerenciamento inteligente de vagas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="h-full transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 border-2 hover:border-primary/50 animate-slide-in">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
