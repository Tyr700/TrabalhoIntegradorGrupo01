const API_URL = "https://grupo01projeto20252.escolatecnicaadelia.info/api";

export interface Car {
  id: string;
  model: string;
  plate: string;
  name: string;
  contact: string;
  createdAt: string;
  departureTime?: string;
  price: number;
}

export interface ParkingSpot {
  id: number;
  occupied: boolean;
  carId?: string;
}

export interface CarFormData {
  modelo: string;
  marca: string;
  placa: string;
  motorista: string;
  telefone: string;
}

export const api = {
  async registerCar(carData: CarFormData) {
    const response = await fetch(`${API_URL}/cadastro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: `${carData.marca} ${carData.modelo}`,
        plate: carData.placa,
        name: carData.motorista,
        contact: carData.telefone,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao cadastrar carro");
    }

    return response.json();
  },

  async getCars(): Promise<Car[]> {
    const response = await fetch(`${API_URL}/verCarro`);
    if (!response.ok) {
      throw new Error("Erro ao buscar carros");
    }
    return response.json();
  },

  async getHistory(): Promise<Car[]> {
    const response = await fetch(`${API_URL}/verCarroHistorico`);
    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }
    return response.json();
  },

  async removeCar(plate: string): Promise<{ message: string; value: number }> {
    const response = await fetch(`${API_URL}/remover`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plate }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao remover carro");
    }

    return response.json();
  },

  async openBarrier() {
    const response = await fetch(`${API_URL}/arduino/abrir-cancela`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao abrir cancela");
    }

    return response.json();
  },

  async closeBarrier() {
    const response = await fetch(`${API_URL}/arduino/fechar-cancela`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao fechar cancela");
    }

    return response.json();
  },

  async openExitBarrier() {
    const response = await fetch(`${API_URL}/arduino/abrir-cancela`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao abrir cancela de saída");
    }

    return response.json();
  },

  async closeExitBarrier() {
    const response = await fetch(`${API_URL}/arduino/fechar-cancela`, {
      method: "POST",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao fechar cancela de saída");
    }

    return response.json();
  },

  async getSpots(): Promise<ParkingSpot[]> {
    const response = await fetch(`${API_URL}/vagas`);
    if (!response.ok) {
      throw new Error("Erro ao buscar vagas");
    }
    return response.json();
  },

  async connectArduino(port: string = "COM3") {
    const response = await fetch(`${API_URL}/arduino/conectar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ porta: port }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao conectar Arduino");
    }

    return response.json();
  },
};
