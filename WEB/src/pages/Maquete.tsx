import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin } from "lucide-react";
import { api, ParkingSpot } from "@/services/api";

const Maquete = () => {
  const navigate = useNavigate();
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const totalSpots = 3;

  useEffect(() => {
    const updateSpots = async () => {
      try {
        const spotsData = await api.getSpots();
        setSpots(spotsData);
      } catch (error) {
        console.error("Erro ao carregar vagas:", error);
      }
    };

    updateSpots();
    const interval = setInterval(updateSpots, 2000);
    return () => clearInterval(interval);
  }, []);

  const occupiedCount = spots.filter(s => s.occupied).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="container mx-auto max-w-5xl">
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
              <MapPin className="h-6 w-6" />
              Maquete em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Vagas Ocupadas</p>
                  <p className="text-3xl font-bold text-primary">{occupiedCount}/{totalSpots}</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-success"></div>
                    <span className="text-sm">Livre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-destructive"></div>
                    <span className="text-sm">Ocupada</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border-4 border-border rounded-lg p-8">
              <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                {spots.map((spot, index) => (
                  <div
                    key={spot.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="border-2 border-border rounded-lg p-6 bg-background min-h-[200px] flex flex-col items-center justify-between">
                      <div className="flex-1 flex items-center justify-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-500 ${
                          spot.occupied ? "bg-primary scale-110" : "bg-muted-foreground/30"
                        }`}>
                          V{spot.id}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className={`w-8 h-8 rounded transition-all duration-500 ${
                          spot.occupied ? "bg-destructive shadow-lg shadow-destructive/50" : "bg-success shadow-lg shadow-success/50"
                        }`}></div>
                        <div className={`w-8 h-8 rounded transition-all duration-500 ${
                          spot.occupied ? "bg-destructive shadow-lg shadow-destructive/50" : "bg-success shadow-lg shadow-success/50"
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>A maquete é atualizada automaticamente em tempo real</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Maquete;
