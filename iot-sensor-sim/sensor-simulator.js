import mqtt from "mqtt";

// Usaremos un broker público gratuito (HiveMQ)
const brokerUrl = "mqtt://broker.hivemq.com";

// Conectamos al broker
const client = mqtt.connect("mqtt://broker.hivemq.com:1883", {
  clientId: "ricardo-sensor-sim-" + Math.random().toString(16).substr(2, 8),
});

// Tema (topic) donde enviaremos datos
const topic = "ricardo/sensors/temperature-humidity";

client.on("connect", () => {
  console.log("✅ Conectado al broker MQTT:", brokerUrl);

  // Enviar cada 2 segundos
  setInterval(() => {
    const data = {
      temperature: (20 + Math.random() * 5).toFixed(2), // 20-25 ºC
      humidity: (40 + Math.random() * 10).toFixed(2),   // 40-50 %
      timestamp: new Date().toISOString(),
    };

    client.publish(topic, JSON.stringify(data));
    console.log("📡 Dato enviado:", data);
  }, 2000);
});