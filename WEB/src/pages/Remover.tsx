import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, XCircle } from "lucide-react";
import { toast } from "sonner";
import { api, Car } from "@/services/api";

const Remover = () => {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState<Car | null>(null);
  const [parkingFee, setParkingFee] = useState<number>(0);

  const handleSearch = async () => {
    if (!placa) {
      toast.error("Digite uma placa");
      return;
    }

    try {
      const vehicles = await api.getCars();
      const vehicle = vehicles.find(
        v => v.plate.toUpperCase() === placa.toUpperCase()
      );

      if (vehicle) {
        setVehicleInfo(vehicle);

        const entryDate = new Date(vehicle.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - entryDate.getTime();
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

        let fee = 10;
        if (diffHours > 1) {
          fee += (diffHours - 1) * 2;
        }

        setParkingFee(fee);
      } else {
        toast.error("Veículo não encontrado");
        setVehicleInfo(null);
        setParkingFee(0);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao buscar veículo");
    }
  };

  const handleRemove = async () => {
    if (!vehicleInfo) return;

    try {
      const result = await api.removeCar(vehicleInfo.plate);

      toast.success(`Veículo removido com sucesso! Valor a pagar: R$ ${result.value.toFixed(2)}`);

      await api.openExitBarrier();
      toast.success("Cancela de saída aberta!");

      setTimeout(async () => {
        await api.closeExitBarrier();
        toast.info("Cancela de saída fechada");
      }, 5000);

      setPlaca("");
      setVehicleInfo(null);
      setParkingFee(0);
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover veículo");
    }
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
                        {vehicleInfo.model}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Placa:</span> {vehicleInfo.plate}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Entrada:</span> {new Date(vehicleInfo.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Motorista:</span> {vehicleInfo.name}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Telefone:</span> {vehicleInfo.contact}
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
