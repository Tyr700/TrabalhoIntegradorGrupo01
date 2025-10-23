# 🚗 Integração Arduino + Node.js - Sistema de Estacionamento

## 📋 O que foi implementado

- **Arduino detecta carro** → Envia `CARRO_DETECTADO` para Node.js
- **Node.js recebe sinal** → Chama automaticamente `createCar()`
- **Sistema abre cancela** → Aguarda 5 segundos e fecha
- **Rotas HTTP** para controle manual da cancela

---

## 🔧 Instalação

### 1. Instalar dependências do Node.js

```bash
npm install serialport @serialport/parser-readline
```

### 2. Upload do código no Arduino

1. Abra o Arduino IDE
2. Abra o arquivo `arduino_estacionamento.ino`
3. Faça upload para o Arduino
4. **Anote a porta COM** (ex: `COM3`, `COM4`)
5. **FECHE o Arduino IDE** (porta serial só pode ser usada por um programa)

### 3. Conectar o Hardware

**Sensor de presença (pino 2):**
- HC-SR04 (ultrassônico) OU
- Sensor infravermelho OU
- Sensor indutivo

**LED (pino 13):**
- LED integrado do Arduino

**Servo Motor (pino 9) - Opcional:**
- Para controlar cancela física

---

## 🚀 Como usar

### 1. Descobrir a porta serial

**Windows:**
```bash
mode
```

**Linux/Mac:**
```bash
ls /dev/tty*
```

### 2. Iniciar o servidor Node.js

```bash
npm start
```

### 3. Conectar ao Arduino via API

```bash
curl -X POST http://localhost:3000/arduino/conectar \
  -H "Content-Type: application/json" \
  -d '{"porta": "COM3"}'
```

### 4. Testar detecção automática

Quando o sensor detectar um carro:
- Arduino envia `CARRO_DETECTADO`
- Node.js cria automaticamente um registro de carro
- Cancela abre por 5 segundos
- Cancela fecha automaticamente

---

## 🌐 Rotas da API

### Arduino

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/arduino/conectar` | Conecta ao Arduino |
| POST | `/arduino/abrir-cancela` | Abre a cancela manualmente |
| POST | `/arduino/fechar-cancela` | Fecha a cancela manualmente |
| POST | `/arduino/desconectar` | Desconecta do Arduino |

### Carros (existentes)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/cadastro` | Cadastra carro manualmente |
| GET | `/verCarro` | Lista carros ativos |
| GET | `/verCarroHistorico` | Lista histórico |
| DELETE | `/remover` | Remove carro |

---

## 📊 Fluxo de Funcionamento

```
1. Sensor detecta carro
   ↓
2. Arduino envia "CARRO_DETECTADO" via Serial
   ↓
3. Node.js recebe mensagem
   ↓
4. ArduinoService.handleCarDetection() é chamado
   ↓
5. CarService.CreateCar() cadastra o carro
   ↓
6. Arduino recebe comando "ABRIR_CANCELA"
   ↓
7. Cancela abre
   ↓
8. Após 5 segundos, cancela fecha
```

---

## 🧪 Teste sem Hardware

Para testar sem Arduino conectado:

1. Comente a linha de conexão no código
2. Use o Monitor Serial do Arduino IDE para simular mensagens
3. Digite `CARRO_DETECTADO` manualmente

---

## ⚙️ Configuração Avançada

### Alterar porta padrão

Edite `src/service/ArduinoService.ts`:

```typescript
constructor(carService: CarService, portPath: string = "COM4") {
  // Altere COM3 para sua porta
}
```

### Personalizar dados do carro

Edite `handleCarDetection()` em `ArduinoService.ts`:

```typescript
const carData = {
  model: "Tesla Model 3",
  plate: `AUTO-${Date.now()}`,
  name: "Cliente VIP",
  contact: "(11) 99999-9999",
};
```

---

## 🐛 Troubleshooting

### Erro: "Port not found"
- Verifique se o Arduino está conectado
- Confirme a porta COM correta
- Feche o Arduino IDE

### Arduino não responde
- Verifique baudRate (deve ser 9600)
- Reconecte o Arduino
- Reinicie o servidor Node.js

### Sensor não detecta
- Verifique conexões do sensor
- Teste com LED integrado (pino 13)
- Use Monitor Serial para debug

---

## 📝 Próximos Passos

- [ ] Integrar com banco de dados
- [ ] Sistema de identificação por placa (OCR)
- [ ] Notificações em tempo real
- [ ] Dashboard web para monitoramento
- [ ] Integração com pagamento automático
