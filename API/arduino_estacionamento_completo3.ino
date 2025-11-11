//Grupo 


#include <Servo.h>

// === SERVOS ===
Servo servoEntrada;
Servo servoSaida;

const int pinoServoEntrada = 9;
const int pinoServoSaida = 10;

// === SENSORES ÓPTICOS (TCRT5000) ===
// Sensores das cancelas
const int sensorEntrada = A0;
const int sensorSaida = A1;

// Sensores das vagas
const int sensorVaga1 = A2;
const int sensorVaga2 = A3;
const int sensorVaga3 = A4;

// === LEDs DAS VAGAS ===
const int ledVerde1 = 2;
const int ledVermelho1 = 3;
const int ledVerde2 = 4;
const int ledVermelho2 = 5;
const int ledVerde3 = 6;
const int ledVermelho3 = 7;

// === VARIÁVEIS DE ESTADO ===
bool entradaAberta = false;
bool saidaAberta = false;
unsigned long tempoFecharEntrada = 0;
unsigned long tempoFecharSaida = 0;
int vagasLivresAnterior = -1;

// Controle de estado das vagas para Serial
bool vaga1Ocupada = false;
bool vaga2Ocupada = false;
bool vaga3Ocupada = false;

// === CONTROLE DE POSIÇÃO DOS SERVOS (EVITA COMANDOS REPETIDOS) ===
int posicaoAtualEntrada = 90;
int posicaoAtualSaida = 90;

// === LIMIAR DE DETECÇÃO DOS SENSORES ===
const int limiteSensor = 300; // quanto menor, mais sensível

// === VARIÁVEL PARA COMANDOS SERIAL ===
String comando = "";

// === CONFIGURAÇÃO INICIAL ===
void setup() {
  // Comunicação Serial PRIMEIRO
  Serial.begin(9600);
  delay(100);
  
  // Inicia os servos
  servoEntrada.attach(pinoServoEntrada);
  servoSaida.attach(pinoServoSaida);

  // Posição inicial fechada
  servoEntrada.write(180);
  servoSaida.write(180);
  delay(500); // Aguarda estabilização inicial
  
  posicaoAtualEntrada = 180;
  posicaoAtualSaida = 180;

  // LEDs como saída
  pinMode(ledVerde1, OUTPUT);
  pinMode(ledVermelho1, OUTPUT);
  pinMode(ledVerde2, OUTPUT);
  pinMode(ledVermelho2, OUTPUT);
  pinMode(ledVerde3, OUTPUT);
  pinMode(ledVermelho3, OUTPUT);

  // Sensores como entrada (analógicos)
  pinMode(sensorEntrada, INPUT);
  pinMode(sensorSaida, INPUT);
  pinMode(sensorVaga1, INPUT);
  pinMode(sensorVaga2, INPUT);
  pinMode(sensorVaga3, INPUT);

  Serial.println("ARDUINO_PRONTO");
  Serial.println("Sistema de controle de estacionamento iniciado.");
  Serial.println("---------------------------------------------");
}

// === LOOP PRINCIPAL ===
void loop() {
  // === Processa comandos do Node.js PRIMEIRO ===
  processarComandosSerial();
  
  // === Vagas ===
  int vagasLivres = contarVagasLivres();

  // Atualiza se houve mudança
  if (vagasLivres != vagasLivresAnterior) {
    vagasLivresAnterior = vagasLivres;
    Serial.print("VAGAS_LIVRES:");
    Serial.println(vagasLivres);
  }

  // === Cancelas ===
  controlaCancelaEntrada(vagasLivres);
  controlaCancelaSaida();

  delay(200);
}

// === FUNÇÕES ===
void abrirCancela(Servo &servo, int &posicaoAtual) {
  if (posicaoAtual != 90) {
    servo.write(90);
    posicaoAtual = 90;
  }
}

void fecharCancela(Servo &servo, int &posicaoAtual) {
  if (posicaoAtual != 180) {
    servo.write(180);
    posicaoAtual = 180;
  }
}

// === CONTROLE DA CANCELA DE ENTRADA COM VERIFICAÇÃO DE VAGAS ===
void controlaCancelaEntrada(int vagasLivres) {
  int leitura = digitalRead(sensorEntrada);

  if (leitura < limiteSensor && !entradaAberta) {
    if (vagasLivres > 0) {
      abrirCancela(servoEntrada, posicaoAtualEntrada);
      entradaAberta = true;
      Serial.println("CANCELA_ENTRADA_ABERTA");
    } else {
      Serial.println("ENTRADA_BLOQUEADA:ESTACIONAMENTO_CHEIO");
    }
  }

  if (entradaAberta) {
    if (leitura > limiteSensor) {
      if (tempoFecharEntrada == 0) tempoFecharEntrada = millis();
      if (millis() - tempoFecharEntrada >= 5000) {
        fecharCancela(servoEntrada, posicaoAtualEntrada);
        entradaAberta = false;
        tempoFecharEntrada = 0;
        Serial.println("CANCELA_ENTRADA_FECHADA");
      }
    } else {
      tempoFecharEntrada = 0;
    }
  }
}

// === CONTROLE DA CANCELA DE SAÍDA ===
void controlaCancelaSaida() {
  int leitura = digitalRead(sensorSaida);

  if (leitura < limiteSensor && !saidaAberta) {
    abrirCancela(servoSaida, posicaoAtualSaida);
    saidaAberta = true;
    Serial.println("CANCELA_SAIDA_ABERTA");
  }

  if (saidaAberta) {
    if (leitura > limiteSensor) {
      if (tempoFecharSaida == 0) tempoFecharSaida = millis();
      if (millis() - tempoFecharSaida >= 5000) {
        fecharCancela(servoSaida, posicaoAtualSaida);
        saidaAberta = false;
        tempoFecharSaida = 0;
        Serial.println("CANCELA_SAIDA_FECHADA");
      }
    } else {
      tempoFecharSaida = 0;
    }
  }
}

// === CONTROLE DAS VAGAS ===
int contarVagasLivres() {
  int livres = 0;

  // VAGA 1
  int leitura1 = analogRead(sensorVaga1);
  bool vaga1Livre = leitura1 >= limiteSensor;
  
  if (vaga1Livre) {
    digitalWrite(ledVerde1, HIGH);
    digitalWrite(ledVermelho1, LOW);
    livres++;
    
    if (vaga1Ocupada) {
      vaga1Ocupada = false;
      Serial.println("VAGA_1_LIVRE");
    }
  } else {
    digitalWrite(ledVerde1, LOW);
    digitalWrite(ledVermelho1, HIGH);
    
    if (!vaga1Ocupada) {
      vaga1Ocupada = true;
      Serial.println("VAGA_1_OCUPADA");
    }
  }

  // VAGA 2
  int leitura2 = analogRead(sensorVaga2);
  bool vaga2Livre = leitura2 >= limiteSensor;
  
  if (vaga2Livre) {
    digitalWrite(ledVerde2, HIGH);
    digitalWrite(ledVermelho2, LOW);
    livres++;
    
    if (vaga2Ocupada) {
      vaga2Ocupada = false;
      Serial.println("VAGA_2_LIVRE");
    }
  } else {
    digitalWrite(ledVerde2, LOW);
    digitalWrite(ledVermelho2, HIGH);
    
    if (!vaga2Ocupada) {
      vaga2Ocupada = true;
      Serial.println("VAGA_2_OCUPADA");
    }
  }

  // VAGA 3
  int leitura3 = analogRead(sensorVaga3);
  bool vaga3Livre = leitura3 >= limiteSensor;
  
  if (vaga3Livre) {
    digitalWrite(ledVerde3, HIGH);
    digitalWrite(ledVermelho3, LOW);
    livres++;
    
    if (vaga3Ocupada) {
      vaga3Ocupada = false;
      Serial.println("VAGA_3_LIVRE");
    }
  } else {
    digitalWrite(ledVerde3, LOW);
    digitalWrite(ledVermelho3, HIGH);
    
    if (!vaga3Ocupada) {
      vaga3Ocupada = true;
      Serial.println("VAGA_3_OCUPADA");
    }
  }

  return livres;
}

// === PROCESSA COMANDOS VINDOS DO NODE.JS ===
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

// === EXECUTA COMANDOS RECEBIDOS ===
void executarComando(String cmd) {
  if (cmd == "ABRIR_CANCELA") {
    abrirCancela(servoEntrada, posicaoAtualEntrada);
    entradaAberta = true;
    Serial.println("CANCELA_ABERTA");
  }
  else if (cmd == "FECHAR_CANCELA") {
    fecharCancela(servoEntrada, posicaoAtualEntrada);
    entradaAberta = false;
    Serial.println("CANCELA_FECHADA");
  }
  else if (cmd == "ABRIR_SAIDA") {
    abrirCancela(servoSaida, posicaoAtualSaida);
    saidaAberta = true;
    Serial.println("SAIDA_ABERTA");
  }
  else if (cmd == "FECHAR_SAIDA") {
    fecharCancela(servoSaida, posicaoAtualSaida);
    saidaAberta = false;
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