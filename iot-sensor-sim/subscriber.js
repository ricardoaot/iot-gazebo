import mqtt from "mqtt";

const brokerUrl = "mqtt://broker.hivemq.com";

const client = mqtt.connect(brokerUrl)
const topic = "ricardo/sensors/temperature-humidity";

client.on('connect', function(){
    client.subscribe(topic)
    console.log("Client has subscribed successfully")
})

client.on("message", function(topic, message){
    console.log(topic, message.toString())
})