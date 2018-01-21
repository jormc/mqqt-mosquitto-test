var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://127.0.0.1');
 
client.on('connect', function () {
  client.subscribe('greetings');
  client.subscribe('time');
  publish ("greetings", "HelloWorld");
  programedPublish();
});
 
client.on('message', function (topic, message) {
  console.log("Published: " + topic.toString() + ' :: ' + message.toString());
});

function publish(topic, message) {
    client.publish(topic, message);
}

function programedPublish() {
    publish("time", new Date().toISOString());
    setTimeout(programedPublish, 1500);
}