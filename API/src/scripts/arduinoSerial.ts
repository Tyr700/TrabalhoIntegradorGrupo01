import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

export class ArduinoSerial {
  private port: SerialPort | null = null;
  private parser: ReadlineParser | null = null;
  private onCarDetectedCallback: (() => void) | null = null;

  constructor(private portPath: string = "COM3", private baudRate: number = 9600) {}

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.port = new SerialPort({
        path: this.portPath,
        baudRate: this.baudRate,
      });

      this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\n" }));

      this.port.on("open", () => {
        console.log(`✅ Conexão serial estabelecida na porta ${this.portPath}`);
        resolve();
      });

      this.port.on("error", (err) => {
        console.error("❌ Erro na porta serial:", err.message);
        reject(err);
      });

      // Escutar mensagens do Arduino
      this.parser.on("data", (data: string) => {
        const message = data.trim();
        console.log("Arduino disse:", message);

        // Quando o sensor detectar um carro
        if (message === "CARRO_DETECTADO") {
          console.log("🚗 Carro detectado pelo sensor!");
          if (this.onCarDetectedCallback) {
            this.onCarDetectedCallback();
          }
        }
      });
    });
  }

  public onCarDetected(callback: () => void): void {
    this.onCarDetectedCallback = callback;
  }

  public sendCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.port) {
        reject(new Error("Porta serial não está conectada"));
        return;
      }

      this.port.write(`${command}\n`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public async openBarrier(): Promise<void> {
    await this.sendCommand("ABRIR_CANCELA");
  }

  public async closeBarrier(): Promise<void> {
    await this.sendCommand("FECHAR_CANCELA");
  }

  public disconnect(): void {
    if (this.port && this.port.isOpen) {
      this.port.close();
      console.log("🔌 Conexão serial fechada");
    }
  }
}
