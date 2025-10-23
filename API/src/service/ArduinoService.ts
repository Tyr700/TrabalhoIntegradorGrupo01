import { ArduinoSerial } from "../scripts/arduinoSerial";
import { CarService } from "./CarService";

export class ArduinoService {
  private arduino: ArduinoSerial;
  private carService: CarService;

  constructor(carService: CarService, portPath: string = "COM3") {
    this.carService = carService;
    this.arduino = new ArduinoSerial(portPath);
  }

  public async initialize(): Promise<void> {
    try {
      await this.arduino.connect();

      // Configurar callback quando carro for detectado
      this.arduino.onCarDetected(() => {
        this.handleCarDetection();
      });

      console.log("🤖 Arduino Service inicializado!");
    } catch (error) {
      console.error("Erro ao inicializar Arduino:", error);
      throw error;
    }
  }

  private async handleCarDetection(): Promise<void> {
    try {
      // Dados temporários para teste - depois você pode integrar com um sistema de identificação
      const carData = {
        model: "Detectado pelo sensor",
        plate: `AUTO-${Date.now()}`,
        name: "A identificar",
        contact: "Pendente",
      };

      console.log("🚗 Tentando cadastrar carro automaticamente...");
      const newCar = this.carService.CreateCar(carData);

      console.log("✅ Carro cadastrado:", newCar);

      // Abrir cancela após cadastro
      await this.arduino.openBarrier();
      console.log("🚧 Cancela aberta!");

      // Fechar cancela após 5 segundos
      setTimeout(async () => {
        await this.arduino.closeBarrier();
        console.log("🚧 Cancela fechada!");
      }, 5000);
    } catch (error: any) {
      console.error("❌ Erro ao processar detecção de carro:", error.message);
    }
  }

  public getArduino(): ArduinoSerial {
    return this.arduino;
  }

  public disconnect(): void {
    this.arduino.disconnect();
  }
}
