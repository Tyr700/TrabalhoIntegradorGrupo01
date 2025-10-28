#include <Servo.h>

const int sensorVaga1 = A5;
const int sensorVaga2 = A4;
const int sensorVaga3 = A3;

const int ledVermelho1 = 6;
const int ledVerde1 = 7;
const int ledVermelho2 = 4;
const int ledVerde2 = 5;
const int ledVermelho3 = 2;
const int ledVerde3 = 3;

const int sensorEntrada = A1;
const int sensorSaida = A2;

Servo servoEntrada;
Servo servoSaida;

bool vaga1Ocupada = false;
bool vaga2Ocupada = false;
bool vaga3Ocupada = false;

String comando = "";

void setup() {
  Serial.begin(9600);

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

  Serial.println("ARDUINO_PRONTO");
}

void loop() {
  verificarVagas();
  processarComandosSerial();
  delay(100);
}

void verificarVagas() {
  bool vaga1Livre = digitalRead(sensorVaga1) == HIGH;
  bool vaga2Livre = digitalRead(sensorVaga2) == HIGH;
  bool vaga3Livre = digitalRead(sensorVaga3) == HIGH;

  if (!vaga1Livre && !vaga1Ocupada) {
    vaga1Ocupada = true;
    digitalWrite(ledVermelho1, HIGH);
    digitalWrite(ledVerde1, LOW);
    Serial.println("VAGA_1_OCUPADA");
  } else if (vaga1Livre && vaga1Ocupada) {
    vaga1Ocupada = false;
    digitalWrite(ledVermelho1, LOW);
    digitalWrite(ledVerde1, HIGH);
    Serial.println("VAGA_1_LIVRE");
  }

  if (!vaga2Livre && !vaga2Ocupada) {
    vaga2Ocupada = true;
    digitalWrite(ledVermelho2, HIGH);
    digitalWrite(ledVerde2, LOW);
    Serial.println("VAGA_2_OCUPADA");
  } else if (vaga2Livre && vaga2Ocupada) {
    vaga2Ocupada = false;
    digitalWrite(ledVermelho2, LOW);
    digitalWrite(ledVerde2, HIGH);
    Serial.println("VAGA_2_LIVRE");
  }

  if (!vaga3Livre && !vaga3Ocupada) {
    vaga3Ocupada = true;
    digitalWrite(ledVermelho3, HIGH);
    digitalWrite(ledVerde3, LOW);
    Serial.println("VAGA_3_OCUPADA");
  } else if (vaga3Livre && vaga3Ocupada) {
    vaga3Ocupada = false;
    digitalWrite(ledVermelho3, LOW);
    digitalWrite(ledVerde3, HIGH);
    Serial.println("VAGA_3_LIVRE");
  }
}

void processarComandosSerial() {
  while (Serial.available() > 0) {
    char c = Serial.read();

    if (c == '\n') {
      comando.trim();
      executarComando(comando);
      comando = "";
    } else {
      comando += c;
    }
  }
}

void executarComando(String cmd) {
  if (cmd == "ABRIR_CANCELA") {
    servoEntrada.write(90);
    Serial.println("CANCELA_ABERTA");
  }
  else if (cmd == "FECHAR_CANCELA") {
    servoEntrada.write(0);
    Serial.println("CANCELA_FECHADA");
  }
  else if (cmd == "ABRIR_SAIDA") {
    servoSaida.write(90);
    Serial.println("SAIDA_ABERTA");
  }
  else if (cmd == "FECHAR_SAIDA") {
    servoSaida.write(0);
    Serial.println("SAIDA_FECHADA");
  }
  else if (cmd == "STATUS") {
    Serial.print("STATUS:");
    Serial.print("V1=");
    Serial.print(vaga1Ocupada ? "OCUPADA" : "LIVRE");
    Serial.print(",V2=");
    Serial.print(vaga2Ocupada ? "OCUPADA" : "LIVRE");
    Serial.print(",V3=");
    Serial.println(vaga3Ocupada ? "OCUPADA" : "LIVRE");
  }
}
