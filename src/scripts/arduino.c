int trig = 13;
int echo = 12;
int ledProximidade = 8;  // LED que acende quando detecta algo próximo
int ledNormal = 7;        // LED que fica sempre ligado
float distancia;
float distanciaLimite = 20; // Distância em cm para acionar o LED
int motorPin = 10;
int botaoPin = 6;
bool botaoLido = HIGH;

void setup() {
pinMode(motorPin, OUTPUT);
  pinMode(botaoPin, INPUT_PULLUP);
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(ledProximidade, OUTPUT);
  pinMode(ledNormal, OUTPUT);
  Serial.begin(9600);
}
void loop() {
    // Garante que o trigger começa em LOW
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  
  // Envia pulso de 10 microsegundos
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  
  // Lê o tempo do pulso de retorno
  distancia = pulseIn(echo, HIGH);
  distancia = distancia / 58; // Converte para centímetros
  
  // Controle alternado dos LEDs
  if (distancia > 0 && distancia <= distanciaLimite) {
    // Objeto detectado próximo
    digitalWrite(ledProximidade, HIGH);  // Liga LED de proximidade
    digitalWrite(ledNormal, LOW);         // Desliga LED normal
  } else {
    // Nada detectado ou longe
    digitalWrite(ledProximidade, LOW);   // Desliga LED de proximidade
    digitalWrite(ledNormal, HIGH);        // Liga LED normal
  }
  
  Serial.print("Distancia: ");
  Serial.print(distancia);
  Serial.println(" cm");
  
  delay(100); // Pequeno delay entre leituras
  botaoLido = digitalRead(botaoPin);
  
  // Quando botão é pressionado (LOW)
  if (botaoLido == LOW) {
    
    // Gira para frente (abre) - DEVAGAR
    analogWrite(motorPin, 10);  // Velocidade reduzida (0-255, usando 100)
    delay(8000);                   // Tempo para girar 90 graus devagar
    analogWrite(motorPin, 0);     // Para o motor
    
    delay(5000);                  // Aguarda 3 segundos (porta aberta)
    
    // Gira para trás (fecha) - DEVAGAR
    analogWrite(motorPin, 10);  // Mesma velocidade lenta
    delay(8000);                   // Tempo para voltar à posição inicial
    analogWrite(motorPin, 0);     // Para o motor
    
    delay(1000);                  // Aguarda 1 segundo antes de permitir novo clique
}
}