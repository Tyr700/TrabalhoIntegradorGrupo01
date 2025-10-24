import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  modelo: string;
  marca: string;
  placa: string;
  motorista: string;
  telefone: string;
  dataEntrada: string;
  dataSaida?: string;
  removido: boolean;
}

const Remover = () => {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState<Vehicle | null>(null);
  const [parkingFee, setParkingFee] = useState<number>(0);

  const handleSearch = () => {
    if (!placa) {
      toast.error("Digite uma placa");
      return;
    }

    const vehicles: Vehicle[] = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const vehicle = vehicles.find(
      v => v.placa.toUpperCase() === placa.toUpperCase() && !v.removido
    );

    if (vehicle) {
      setVehicleInfo(vehicle);
      
      // Calculate parking fee
      const entryDate = new Date(vehicle.dataEntrada.split(", ")[0].split("/").reverse().join("-") + " " + vehicle.dataEntrada.split(", ")[1]);
      const now = new Date();
      const diffMs = now.getTime() - entryDate.getTime();
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      
      let fee = 10; // First hour
      if (diffHours > 1) {
        fee += (diffHours - 1) * 2; // Additional hours
      }
      
      setParkingFee(fee);
    } else {
      toast.error("Veículo não encontrado ou já foi removido");
      setVehicleInfo(null);
      setParkingFee(0);
    }
  };

  const handleRemove = () => {
    if (!vehicleInfo) return;

    const vehicles: Vehicle[] = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const updatedVehicles = vehicles.map(v =>
      v.id === vehicleInfo.id
        ? { ...v, removido: true, dataSaida: new Date().toLocaleString("pt-BR") }
        : v
    );

    localStorage.setItem("vehicles", JSON.stringify(updatedVehicles));
    toast.success(`Veículo removido com sucesso! Valor a pagar: R$ ${parkingFee.toFixed(2)}`);
    
    setPlaca("");
    setVehicleInfo(null);
    setParkingFee(0);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="container mx-auto max-w-4xl">
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
              <XCircle className="h-6 w-6" />
              Remover Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="placa">Digite a Placa do Veículo</Label>
              <div className="flex gap-2">
                <Input
                  id="placa"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC1234"
                  maxLength={7}
                  className="flex-1"
                />
                <Button onClick={handleSearch}>Buscar</Button>
              </div>
            </div>

            {vehicleInfo && (
              <Card className="animate-fade-in border-2 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-primary">
                    Informações do Veículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Veículo:</span>{" "}
                        {vehicleInfo.marca} {vehicleInfo.modelo}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Placa:</span> {vehicleInfo.placa}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Entrada:</span> {vehicleInfo.dataEntrada}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Motorista:</span> {vehicleInfo.motorista}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Telefone:</span> {vehicleInfo.telefone}
                      </p>
                    </div>
                  </div>
                  <div className="mb-6 p-4 bg-primary/10 rounded-lg border-2 border-primary">
                    <p className="text-lg font-bold text-primary text-center">
                      Valor a Pagar: R$ {parkingFee.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      1ª hora: R$ 10,00 | Demais horas: R$ 2,00/hora
                    </p>
                  </div>
                  <Button
                    onClick={handleRemove}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    Confirmar Saída do Veículo
                  </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Remover;
