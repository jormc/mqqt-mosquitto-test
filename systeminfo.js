const si = require('systeminformation');
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1');

console.log('Publishing system data every 30 secods (press Ctrl+C to quit)');
console.log('Mqtt broker:', client.options.host, client.options.port);
console.log('-----------------------------------------------------------------------');

setInterval(function () {
    publish();
}, 5000);

function publish() {
    // si.cpu(function (data) {
    //     console.log('CPU-Information:', data);
    // });

    si.cpuTemperature(function (data) {
        // console.log('CPI-Temperature:', data);
        for (var i = 0; i < data.cores.length; i++) {
            const topic = '/system/core/' + i + '/temp';
            const value = data.cores[i];
            console.log('Publishing:', topic, value);
            client.publish(topic.toString(), value.toString());
        }
    });
}
