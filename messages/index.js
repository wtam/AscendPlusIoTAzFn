var clientFromConnectionString = require('azure-iot-device-http').clientFromConnectionString;

var Message = require('azure-iot-device').Message;

function processRequest(context, req) {
    context.log('Node.js HTTP trigger function processed a request. DeviceID=%s DeviceKey=%s',req.body.deviceId, req.body.deviceKey);
    var connectionString = `HostName=${process.env.IOTHUB_HOSTNAME};DeviceId=${req.body.deviceId};SharedAccessKey=${req.body.deviceKey}`  

    context.log('Before registry to IoTHub.....');
    var client = clientFromConnectionString(connectionString);
    context.log('Connecting to IoTHub.....');

    //
    context.log('this is a test of the console');
    context.log('just before load of azure-storage');
    var foo = require('azure-storage');
    context.log('just after load of azure-storage');
    //

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