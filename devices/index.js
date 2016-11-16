function processRequest(context, req) {
        /*var printDeviceInfo = function(err, deviceInfo, res) {
        if (deviceInfo) {
            console.log('Device id: ' + deviceInfo.deviceID);
            console.log('Device key: ' + deviceInfo.authentication.SymmetricKey.primaryKey);
        }
    }*/

    var iothub = require ('azure-iothub')
    //var connectionString = 'HostName=TofugearIoTHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=i0dmaUYa2WGiR6Kh76KwWP2633KCpFKejTUUNfXWuxM=';
    var connectionString = `HostName=${process.env.IOTHUB_HOSTNAME};SharedAccessKeyName=iothubowner;SharedAccessKey=${process.env.IOTHUBOWNER_SHAREDACCESSKEY}`

    var registry = iothub.Registry.fromConnectionString(connectionString)
   
    // var device = new iothub.device(null) //remove this code as its seems the new npm package keep complain that .device is not constructor
    // replace wiht the following 
    var device = {
        deviceId: null
    };

    device.deviceId = req.body.deviceId

    registry.create(device, function(err, deviceInfo, res) {
        if (err) {
            registry.get(device.deviceId, function(err, deviceInfo, res) { 
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
                body: JSON.stringify({"deviceInfo": deviceInfo})
            }
            context.done();
        }
    })
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

