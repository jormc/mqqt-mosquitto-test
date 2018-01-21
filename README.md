# mqqt-mosquitto-test

Testing MQTT protocol with Mosquitto &amp; NodeJS

# Installation

## Download project

Download this project, or just clone it to your workspace. 

Note that you need to modify the filesystem permissions in order to run docker with user permissions. So, after download the project, run this command:

    $ cd mqtt-mosquitto-test
    $ sudo chmod a+rw -R ./mosquitto/*

## Requirements

### NodeJS

Download and install **NodeJS** into your machine to run the examples.

See: https://nodejs.org

### Mosquitto

#### Run with Docker Compose

***NOTE:** You'll need Docker & Docker Compose installed on your system*

This project has a composed docker image that allows to you to quickly test a mosquitto server without install in your machine. So you can just run the *docker-compose* file located into the docker folder:

    $ cd docker
    $ docker-compose up

After that, you will be able to publish topics to your mosquitto local server. You'll find all the basic configuration under the **docker/mosquitto/config/mosquitto.conf** file:

    pid_file /var/run/mosquitto.pid

    persistence true
    persistence_location /mosquitto/data/

    user mosquitto

    port 1883

    log_dest file /mosquitto/log/mosquitto.log

#### Install Mosquitto Server

Just install and run your own Mosquitto Server in your local machine (or wherever you want, but if so then you'll need to condifure host & port into the example files).

Look at: *https://mosquitto.org/download/*

### Mosquitto Clients

They're not necessary, but if youi want, you can download them and test the node examples with them, too.

For Ubunto:

    $ sudo apt update
    $ sudo apt install mosquitto-clients

## Run the examples

Before continue, please run next npm command to install dependencies:

    $ npm install

### Subscribe

The **subscribe.js** file shows how to connect to Mosquitto:

    var mqtt = require('mqtt');
    var client  = mqtt.connect('mqtt://127.0.0.1');
 
    client.on('connect', function () {
        client.subscribe('#');
    });
 
    client.on('message', function (topic, message) {
        console.log("Published: " + topic.toString() + ' :: ' + message.toString());
    });

In this example, we'll use the MQTT node library to create the client. 

* On *client connect* we'll subscribe to all topics on Mosquitto server (**#** topic). 
* On *client message*, we'll get all the topics contents that we've subcribed (all!), and you them in the console

Run it with:

    $ node subscribe.js

And then you can publish some test topic with the Mosquitto Client, such like:

    $ mosquitto_pub -t test -m "Hello World!"

Then, the subscribe script will shows some like this in the console:

    $ node subscribe.js 
    Published: test :: Hello World!

## Publish & Subscribe

The second example si very similar last, but in this time we'll subscribe to a topic, and then publish to it every 1500ms:

    var mqtt = require('mqtt');
    var client  = mqtt.connect('mqtt://127.0.0.1');
    
    client.on('connect', function () {
        client.subscribe('greetings');
        client.subscribe('time');
        publish ("test", "HelloWorld");
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

One more time: 

* starts the client
* subscribe to ***greetings*** and ***time*** topics
* publish some welcome ***greetings*** topic message, such like *HelloWorld!*
* the client *on message* will show the *greetings* topic message *HelloWorld!*
* and then call to the programmed publish function, that will publish the date every 1500ms

        $ node pub_sub.js 
        Published: greetings :: HelloWorld
        Published: time :: 2018-01-21T19:09:11.435Z
        Published: time :: 2018-01-21T19:09:12.938Z
        Published: time :: 2018-01-21T19:09:14.440Z
        Published: time :: 2018-01-21T19:09:15.942Z
