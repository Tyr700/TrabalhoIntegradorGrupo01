import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  placa: string;
  motorista: string;
  telefone: string;
  dataEntrada: string;
  removido: boolean;
}

const Cadastro = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [formData, setFormData] = useState({
    modelo: "",
    marca: "",
    placa: "",
    motorista: "",
    telefone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.modelo || !formData.marca || !formData.placa || !formData.motorista || !formData.telefone) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const vehicles: Vehicle[] = JSON.parse(localStorage.getItem("vehicles") || "[]");
    
    const vehicleExists = vehicles.some(v => v.placa.toUpperCase() === formData.placa.toUpperCase());
    if (vehicleExists) {
      toast.error("Veículo com esta placa já está cadastrado");
      return;
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      ...formData,
      placa: formData.placa.toUpperCase(),
      dataEntrada: new Date().toLocaleString("pt-BR"),
      removido: false,
    };

    vehicles.push(newVehicle);
    localStorage.setItem("vehicles", JSON.stringify(vehicles));

    setShowAnimation(true);
    toast.success("Veículo cadastrado com sucesso!");

    setTimeout(() => {
      setFormData({
        modelo: "",
        marca: "",
        placa: "",
        motorista: "",
        telefone: "",
      });
      setShowAnimation(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="text-2xl">Cadastro de Veículo e Motorista</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-lg">Dados do Veículo</h3>
                  <div>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={formData.modelo}
                      onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                      placeholder="Ex: Civic"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={formData.marca}
                      onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                      placeholder="Ex: Honda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="placa">Placa</Label>
                    <Input
                      id="placa"
                      value={formData.placa}
                      onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                      placeholder="Ex: ABC1234"
                      maxLength={7}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-semibold text-lg">Dados do Motorista</h3>
                  <div>
                    <Label htmlFor="motorista">Nome Completo</Label>
                    <Input
                      id="motorista"
                      value={formData.motorista}
                      onChange={(e) => setFormData({ ...formData, motorista: e.target.value })}
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      placeholder="Ex: (11) 99999-9999"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Cadastrar Veículo
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center">
            <Card className="w-full animate-slide-in" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {/* Base da catraca */}
                    <div className="absolute bottom-0 w-20 h-32 bg-gradient-to-b from-muted-foreground to-foreground rounded-lg shadow-xl" />
                    
                    {/* Topo da catraca */}
                    <div className="absolute top-0 w-20 h-12 bg-gradient-to-b from-muted-foreground to-foreground rounded-t-lg shadow-xl" />
                    
                    {/* Barreira/Braço da catraca */}
                    <div 
                      className={`absolute w-2 bg-gradient-to-r from-destructive to-orange-500 rounded-full shadow-2xl origin-bottom transition-all duration-1000 ease-in-out ${
                        showAnimation 
                          ? "h-32 rotate-90 translate-x-16 opacity-80" 
                          : "h-40 rotate-0 translate-x-0"
                      }`}
                      style={{
                        top: '12px',
                        left: '50%',
                        transform: showAnimation 
                          ? 'translateX(-50%) translateX(64px) rotate(90deg)' 
                          : 'translateX(-50%) rotate(0deg)'
                      }}
                    />
                    
                    {/* Luz indicadora */}
                    <div 
                      className={`absolute top-2 w-4 h-4 rounded-full transition-all duration-500 ${
                        showAnimation 
                          ? "bg-success shadow-[0_0_20px_rgba(34,197,94,0.8)]" 
                          : "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                      }`}
                    />
                  </div>
                  
                  {showAnimation && (
                    <p className="mt-6 text-success font-semibold text-lg animate-fade-in">
                      ✓ Acesso Liberado!
                    </p>
                  )}
                  {!showAnimation && (
                    <p className="mt-6 text-muted-foreground">
                      Aguardando cadastro...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
