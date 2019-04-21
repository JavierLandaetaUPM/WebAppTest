const express = require('express');
const router = express.Router();
//const Client = require('azure-iot-device').Client;
//const Message = require('azure-iot-device').Message;
//const Protocol = require('azure-iot-device-mqtt').Mqtt;

router.get('/commands', (req, res) =>{
    res.render('commands');
});
router.post('/commands', async (req, res) =>{
    console.log(req.body);
    const { command, options } = req.body;
    const errors = [];
    if (!command){
        errors.push({text: 'Please insert a command'});
    }
    if (errors.length >0){
        res.render('commands', {
            errors,
            command
        });
    }else{
        req.flash('success_msg', "Command send Successfully");
        res.redirect('commands');
        // ENVIAR AQUI EL "command" a AZURE
        if(options == 'simulated'){
            

        }
        if(options == 'raspberry'){
            console.log(command);
            
            var methodParams = {
                methodName: 'stop', //no payload for stop
                responseTimeoutInSeconds: 30
            };
            await invokeDeviceM(methodParams);
            var methodParams = {
                methodName: 'SetTelemetryInterval',
                payload: command, // command.
                responseTimeoutInSeconds: 30
            };
            await invokeDeviceM(methodParams);
            var methodParams = {
                methodName: 'start', // no payload for start.
                responseTimeoutInSeconds: 30
            };
            await invokeDeviceM(methodParams);
        }
        if(options == 'stp'){
            
        }
        
    }
});

function invokeDeviceM(methodParams) {
    const connectionString = 'HostName=g5-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=N5tJ8Uw4xF+aBJZ/WgY/yY109+8n4OWruLX6I5A+3Jw=';
    var Client = require('azure-iothub').Client;
    var deviceId = 'g5-rpi-simulated';
    var client = Client.fromConnectionString(connectionString);
    client.invokeDeviceMethod(deviceId, methodParams, async function (err, result) {
        if (err) {
            console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
        } else {
            console.log('Response from ' + methodParams.methodName + ' on ' + deviceId + ':');
            console.log(JSON.stringify(result, null, 2));
        }
      });
  }

module.exports = router;