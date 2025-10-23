#include <Servo.h>

// Sensores das vagas
const int sensorVaga1 = A5;
const int sensorVaga2 = A4;
const int sensorVaga3 = A3;

// LEDs das vagas
const int ledVermelho1 = 6;
const int ledVerde1 = 7;
const int ledVermelho2 = 4;
const int ledVerde2 = 5;
const int ledVermelho3 = 2;
const int ledVerde3 = 3;

// Sensores de entrada e saída
const int sensorEntrada = A1;
const int sensorSaida = A2;

// Servos motores
Servo servoEntrada;
Servo servoSaida;

// Controle de entrada
bool entradaLiberada = false;

void setup() {
  pinMode(sensorVaga1, INPUT);
  pinMode(sensorVaga2, INPUT);
  pinMode(sensorVaga3, INPUT);
  pinMode(sensorEntrada, INPUT);
  pinMode(sensorSaida, INPUT);

  pinMode(ledVermelho1, OUTPUT);
  pinMode(ledVerde1, OUTPUT);
  pinMode(ledVermelho2, OUTPUT);
  pinMode(ledVerde2, OUTPUT);
  pinMode(ledVermelho3, OUTPUT);
  pinMode(ledVerde3, OUTPUT);

  servoEntrada.attach(8);
  servoSaida.attach(9);
  servoEntrada.write(0);
  servoSaida.write(0);
}

void loop() {
  // Verifica estado das vagas
  bool vaga1Livre = digitalRead(sensorVaga1) == HIGH;
  bool vaga2Livre = digitalRead(sensorVaga2) == HIGH;
  bool vaga3Livre = digitalRead(sensorVaga3) == HIGH;

  // Atualiza LEDs
  atualizarLEDs(vaga1Livre, ledVermelho1, ledVerde1);
  atualizarLEDs(vaga2Livre, ledVermelho2, ledVerde2);
  atualizarLEDs(vaga3Livre, ledVermelho3, ledVerde3);

  // Verifica se o sensor de entrada foi acionado
  if (digitalRead(sensorEntrada) == LOW) {
    entradaLiberada = true;
  }

  // Se entrada foi acionada, verifica se há vaga livre
  if (entradaLiberada && (vaga1Livre || vaga2Livre || vaga3Livre)) {
    servoEntrada.write(90); // abre cancela
    delay(5000);
    servoEntrada.write(0);  // fecha cancela
    entradaLiberada = false; // reseta controle
  }

  // Verifica saída
  if (digitalRead(sensorSaida) == LOW) {
    servoSaida.write(90); // abre cancela
    delay(3000);
    servoSaida.write(0);  // fecha cancela
  }

  delay(50);
}

void atualizarLEDs(bool vagaLivre, int ledVermelho, int ledVerde) {
  digitalWrite(ledVermelho, !vagaLivre);
  digitalWrite(ledVerde, vagaLivre);
}