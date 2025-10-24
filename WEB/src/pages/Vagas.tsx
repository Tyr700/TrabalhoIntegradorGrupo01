import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Car } from "lucide-react";

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

const Vagas = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadVehicles = () => {
      const stored: Vehicle[] = JSON.parse(localStorage.getItem("vehicles") || "[]");
      setVehicles(stored.filter(v => !v.removido));
    };

    loadVehicles();
    window.addEventListener("storage", loadVehicles);
    return () => window.removeEventListener("storage", loadVehicles);
  }, []);

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

        <Card className="animate-slide-in">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Car className="h-6 w-6" />
              Veículos nas Vagas ({vehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">
                  Nenhum veículo estacionado no momento
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {vehicles.map((vehicle, index) => (
                  <Card
                    key={vehicle.id}
                    className="animate-slide-in hover:shadow-[var(--shadow-hover)] transition-shadow"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-2 text-primary">
                            {vehicle.marca} {vehicle.modelo}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Placa:</span> {vehicle.placa}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Entrada:</span> {vehicle.dataEntrada}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Motorista:</span> {vehicle.motorista}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Telefone:</span> {vehicle.telefone}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vagas;
