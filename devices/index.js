var iothub = require('azure-iothub')

function processRequest(context, req) {
    context.log('Node.js HTTP trigger function processed a request DeviceID=%s', req.body.deviceId)
        
    var connectionString = `HostName=${process.env.IOTHUB_HOSTNAME};SharedAccessKeyName=iothubowner;SharedAccessKey=${process.env.IOTHUBOWNER_SHAREDACCESSKEY}`

    context.log('Before registry to IoTHub.....')
    var registry = iothub.Registry.fromConnectionString(connectionString)
    context.log('Connecting to IoTHub.....')
    //var device = new iothub.Device(null) //remove this code as its seems the new npm package keep complain that .device is not constructor
    // replace with the following 
    var device = {
        deviceId: null
    };

    device.deviceId = req.body.deviceId
    registry.create(device, function (err, deviceInfo, res) {
        context.log('IoTHub connected......registering: ', device.deviceId)
        if (err) {
            registry.get(device.deviceId, function (err, deviceInfo, res) { 
                context.log('Error Device registering!..', JSON.stringify({ "deviceInfo": deviceInfo }) )
                context.res = {
                    status: 500,
                    body: JSON.stringify({
                        "status": 500,
                        "error": 'unable to create device',
                        "deviceInfo": deviceInfo 
                    })
                }              
                context.done()          
            });                     
        } else if (deviceInfo) {
            context.res = {
                status: 201,
                body: JSON.stringify({ "deviceInfo": deviceInfo })
            }
            context.log('Device registered..', JSON.stringify({ "deviceInfo": deviceInfo }))
            context.done();
        }
    })
}

function routeRequest(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl)

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

