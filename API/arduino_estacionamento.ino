// Código Arduino para estacionamento inteligente
// Salve como: arduino_estacionamento.ino

// Pinos
const int sensorPin = 2;        // Sensor de presença (HC-SR04 ou infravermelho)
const int ledPin = 13;          // LED indicador
const int servoPin = 9;         // Servo motor para cancela (opcional)

String comando = "";
bool carroDetectado = false;

void setup() {
  Serial.begin(9600);
  
  pinMode(sensorPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(servoPin, OUTPUT);
  
  digitalWrite(ledPin, LOW);
  
  Serial.println("Arduino pronto!");
  Serial.println("Sistema de estacionamento inicializado");
}

void loop() {
  // Ler sensor de presença
  int sensorValue = digitalRead(sensorPin);
  
  // Se detectar carro (sensor HIGH) e ainda não foi reportado
  if (sensorValue == HIGH && !carroDetectado) {
    carroDetectado = true;
    digitalWrite(ledPin, HIGH);
    
    // Enviar mensagem para o Node.js
    Serial.println("CARRO_DETECTADO");
    
    delay(1000); // Debounce
  }
  
  // Se o carro sair (sensor LOW)
  if (sensorValue == LOW && carroDetectado) {
    carroDetectado = false;
    digitalWrite(ledPin, LOW);
    Serial.println("CARRO_SAIU");
  }
  
  // Ler comandos do Node.js via Serial
  while (Serial.available() > 0) {
    char c = Serial.read();
    
    if (c == '\n') {
      processarComando(comando);
      comando = ""; // Limpar
    } else {
      comando += c;
    }
  }
  
  delay(100); // Pequeno delay para estabilidade
}

void processarComando(String cmd) {
  cmd.trim(); // Remove espaços
  
  if (cmd == "ABRIR_CANCELA") {
    abrirCancela();
    Serial.println("Cancela aberta!");
  } 
  else if (cmd == "FECHAR_CANCELA") {
    fecharCancela();
    Serial.println("Cancela fechada!");
  }
  else if (cmd == "LED_ON") {
    digitalWrite(ledPin, HIGH);
    Serial.println("LED aceso!");
  }
  else if (cmd == "LED_OFF") {
    digitalWrite(ledPin, LOW);
    Serial.println("LED apagado!");
  }
  else if (cmd == "STATUS") {
    enviarStatus();
  }
  else {
    Serial.println("Comando desconhecido: " + cmd);
  }
}

void abrirCancela() {
  // Simular abertura de cancela com servo
  // Se usar servo motor: servo.write(90);
  digitalWrite(ledPin, HIGH);
  Serial.println("Cancela em abertura...");
}

void fecharCancela() {
  // Simular fechamento de cancela com servo
  // Se usar servo motor: servo.write(0);
  digitalWrite(ledPin, LOW);
  Serial.println("Cancela em fechamento...");
}

void enviarStatus() {
  Serial.print("STATUS:");
  Serial.print("Sensor=");
  Serial.print(digitalRead(sensorPin));
  Serial.print(",LED=");
  Serial.println(digitalRead(ledPin));
}
