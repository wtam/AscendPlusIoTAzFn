var clientFromConnectionString = require('azure-iot-device-http').clientFromConnectionString;

var Message = require('azure-iot-device').Message;

function processRequest(context, req) {
    context.log('Node.js HTTP trigger function processed a request. DeviceID=%s DeviceKey=%s',req.body.deviceId, req.body.deviceKey);

    ////var clientFromConnectionString = require('azure-iot-device-amqp').clientFromConnectionString;
    //context.log('azure-iot-device-http pkg loading.......');
    //var clientFromConnectionString = require('azure-iot-device-http').clientFromConnectionString;
    //context.log('azure-iot-device-http pkg loaded');

    //context.log('azure-iot-device pkg loading.......');
    //var Message = require('azure-iot-device').Message;
    //context.log('azure-iot-device pkg loaded');

    var connectionString = `HostName=${process.env.IOTHUB_HOSTNAME};DeviceId=${req.body.deviceId};SharedAccessKey=${req.body.deviceKey}`  

    context.log('Connecting to IoTHub.....');
    var client = clientFromConnectionString(connectionString);
    var messageSent = false;

    var connectCallback = function (err) {
      if (err) {
        context.log('Could not connect: ' + err);
      } else {
        context.log('IotHub connected');

        // Create a message and send it to the IoT Hub
        var msg = new Message(JSON.stringify({ deviceId: req.body.deviceId, Data: req.body.deviceMessage }));
        context.log('Message sending.....');
        client.sendEvent(msg, function (err) {
          if (err) {
            console.log(err.toString());
          } else {
            context.log('Message sent');
            messageSent = true;
            context.res = {
                  status: 201,
                  body: JSON.stringify({Data: req.body.deviceMessage + ' from ' + req.body.deviceId + ' sent successfully'})
              }
              context.done();
          };
        });
      }
    };
    client.open(connectCallback);
}
function routeRequest(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    if (req.query.action == 'ping')
    {
        context.log('ping, ignore')
        context.done()
    }    
    else
        processRequest(context, req)
}

module.exports = function(context, req) {
  routeRequest(context, req)
};